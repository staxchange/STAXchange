import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SendSupportMessageCommandInput {
  conversationId: string;
  message: string;
  note?: string;
}

export interface SendSupportMessageCommandDTO {
  id: string;
  workflow: "tech-support";
  status: "AI_TRIAGE";
  command: "SendSupportMessageCommand";
}

export class SendSupportMessageCommand implements GovernedCommand<SendSupportMessageCommandInput, SendSupportMessageCommandDTO> {
  validateInput(input: SendSupportMessageCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.conversationId) throw new Error("conversationId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: SendSupportMessageCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "support.message.send");
  }

  async executeMutation(input: SendSupportMessageCommandInput, context: CommandContext): Promise<SendSupportMessageCommandDTO> {
    void context;
    // Placeholder only. Production support persistence belongs here and nowhere in apps/*.
    return {
      id: String(input.conversationId),
      workflow: "tech-support",
      status: "AI_TRIAGE",
      command: "SendSupportMessageCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: SendSupportMessageCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "SendSupportMessageCommand",
        workflow: "tech-support",
        entityId: String(input.conversationId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): SendSupportMessageCommandDTO {
    const result = mutationResult as SendSupportMessageCommandDTO;
    return {
      id: result.id,
      workflow: "tech-support",
      status: "AI_TRIAGE",
      command: "SendSupportMessageCommand"
    };
  }

  async run(input: SendSupportMessageCommandInput, context: CommandContext): Promise<CommandResult<SendSupportMessageCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
