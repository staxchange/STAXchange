import { NextResponse } from "next/server";
import {
  evaluateSupportHandoff,
  fallbackAssistantMessage,
  generateSupportReply,
  sanitizeSupportChatRequest,
  type SanitizedSupportChatRequestDTO,
  type SupportChatResponseDTO,
  type SupportHandoffDecisionDTO,
  type SupportTicketDTO
} from "@stax/ai-support";
import {
  CreateSupportConversationCommand,
  CreateSupportTicketCommand,
  SendSupportMessageCommand
} from "@stax/commands";

export const runtime = "nodejs";

function newConversationId(): string {
  return `support-${crypto.randomUUID()}`;
}

function assistantResponse(content: string) {
  return {
    role: "assistant" as const,
    content,
    createdAt: new Date().toISOString()
  };
}

function aiUnavailableHandoff(): SupportHandoffDecisionDTO {
  return {
    required: true,
    reason: "AI_UNAVAILABLE",
    severity: "NORMAL",
    summary: "AI support assistant was unavailable, so human support review is required.",
    nextAction: "CREATE_TICKET"
  };
}

async function createHumanSupportTicket(input: {
  conversationId: string;
  handoff: SupportHandoffDecisionDTO;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  context: {
    actor: { id: string; role: "PUBLIC" };
    requestId: string;
  };
}): Promise<SupportTicketDTO | undefined> {
  const command = new CreateSupportTicketCommand();
  const result = await command.run(
    {
      conversationId: input.conversationId,
      summary: input.handoff.summary,
      severity: input.handoff.severity,
      reason: input.handoff.reason
    },
    input.context
  );

  if (!result.ok || !result.data) return undefined;

  return {
    id: result.data.id,
    conversationId: input.conversationId,
    status: "HUMAN_REVIEW_REQUIRED",
    severity: input.handoff.severity,
    reason: input.handoff.reason,
    summary: input.handoff.summary,
    customer: input.customer,
    createdAt: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON request body." }, { status: 400 });
  }

  let body: SanitizedSupportChatRequestDTO;

  try {
    body = sanitizeSupportChatRequest(rawBody);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid support chat request."
      },
      { status: 400 }
    );
  }

  const conversationId = body.conversationId ?? newConversationId();
  const latestUserMessage = body.latestUserMessage;
  const actor = { id: body.customer?.email ?? "public-support-web", role: "PUBLIC" as const };
  const context = { actor, requestId };

  const createConversation = new CreateSupportConversationCommand();
  await createConversation.run(
    {
      conversationId,
      customerEmail: body.customer?.email,
      initialMessage: latestUserMessage
    },
    context
  );

  const sendMessage = new SendSupportMessageCommand();
  await sendMessage.run({ conversationId, message: latestUserMessage }, context);

  // Hard rule: escalation classification happens before any AI call.
  const handoff = evaluateSupportHandoff(body.messages);

  if (handoff.required) {
    const ticket = await createHumanSupportTicket({
      conversationId,
      handoff,
      customer: body.customer,
      context
    });

    const message = assistantResponse(fallbackAssistantMessage(handoff));
    await sendMessage.run({ conversationId, message: message.content }, context);

    const response: SupportChatResponseDTO = {
      conversationId,
      message,
      handoff,
      ticket
    };

    return NextResponse.json(response);
  }

  try {
    const assistantText = await generateSupportReply({
      request: { conversationId, customer: body.customer, messages: body.messages },
      handoff,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_SUPPORT_MODEL
    });

    const message = assistantResponse(assistantText);
    await sendMessage.run({ conversationId, message: message.content }, context);

    const response: SupportChatResponseDTO = {
      conversationId,
      message,
      handoff
    };

    return NextResponse.json(response);
  } catch {
    const unavailable = aiUnavailableHandoff();
    const ticket = await createHumanSupportTicket({
      conversationId,
      handoff: unavailable,
      customer: body.customer,
      context
    });

    const message = assistantResponse(fallbackAssistantMessage(unavailable));
    await sendMessage.run({ conversationId, message: message.content }, context);

    const response: SupportChatResponseDTO = {
      conversationId,
      message,
      handoff: unavailable,
      ticket
    };

    return NextResponse.json(response);
  }
}
