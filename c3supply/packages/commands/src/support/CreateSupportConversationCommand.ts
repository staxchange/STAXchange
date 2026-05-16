import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateSupportConversationCommandInput {
  conversationId: string;
  customerEmail?: string;
  initialMessage: string;
  note?: string;
}

export interface CreateSupportConversationCommandDTO {
  id: string;
  workflow: "tech-support";
  status: "AI_TRIAGE";
  command: "CreateSupportConversationCommand";
}

export class CreateSupportConversationCommand implements GovernedCommand<CreateSupportConversationCommandInput, CreateSupportConversationCommandDTO> {
  validateInput(input: CreateSupportConversationCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.conversationId) throw new Error("conversationId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateSupportConversationCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "support.conversation.create");
  }

  async executeMutation(input: CreateSupportConversationCommandInput, context: CommandContext): Promise<CreateSupportConversationCommandDTO> {
    void context;
    // Placeholder only. Production support persistence belongs here and nowhere in apps/*.
    return {
      id: String(input.conversationId),
      workflow: "tech-support",
      status: "AI_TRIAGE",
      command: "CreateSupportConversationCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateSupportConversationCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateSupportConversationCommand",
        workflow: "tech-support",
        entityId: String(input.conversationId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateSupportConversationCommandDTO {
    const result = mutationResult as CreateSupportConversationCommandDTO;
    return {
      id: result.id,
      workflow: "tech-support",
      status: "AI_TRIAGE",
      command: "CreateSupportConversationCommand"
    };
  }

  async run(input: CreateSupportConversationCommandInput, context: CommandContext): Promise<CommandResult<CreateSupportConversationCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
