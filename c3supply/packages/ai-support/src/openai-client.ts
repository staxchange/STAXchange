import { buildSupportUserContext, supportAssistantSystemPrompt } from "./support-prompt";
import type { SupportChatRequestDTO, SupportHandoffDecisionDTO, SupportMessageDTO } from "./types";

interface OpenAIChatChoice {
  message?: {
    content?: string;
  };
}

interface OpenAIChatResponse {
  choices?: OpenAIChatChoice[];
}

export interface GenerateSupportReplyInput {
  request: SupportChatRequestDTO;
  handoff: SupportHandoffDecisionDTO;
  apiKey?: string;
  model?: string;
}

export async function generateSupportReply(input: GenerateSupportReplyInput): Promise<string> {
  if (input.handoff.required) {
    throw new Error("OpenAI reply blocked because human handoff is required.");
  }

  if (!input.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const messages = input.request.messages.slice(-8).map((message): SupportMessageDTO => ({
    role: message.role,
    content: message.content
  }));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: input.model ?? "gpt-5-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: supportAssistantSystemPrompt },
        { role: "system", content: buildSupportUserContext(input.handoff.summary) },
        ...messages
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI support reply failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OpenAIChatResponse;
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("OpenAI support reply was empty.");
  }

  return content;
}
