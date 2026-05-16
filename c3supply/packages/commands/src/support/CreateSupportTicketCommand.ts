import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateSupportTicketCommandInput {
  conversationId: string;
  summary: string;
  severity: string;
  reason: string;
  note?: string;
}

export interface CreateSupportTicketCommandDTO {
  id: string;
  workflow: "tech-support";
  status: "HUMAN_REVIEW_REQUIRED";
  command: "CreateSupportTicketCommand";
}

export class CreateSupportTicketCommand implements GovernedCommand<CreateSupportTicketCommandInput, CreateSupportTicketCommandDTO> {
  validateInput(input: CreateSupportTicketCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.conversationId) throw new Error("conversationId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateSupportTicketCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "support.ticket.create");
  }

  async executeMutation(input: CreateSupportTicketCommandInput, context: CommandContext): Promise<CreateSupportTicketCommandDTO> {
    void context;
    // Placeholder only. Production support persistence belongs here and nowhere in apps/*.
    return {
      id: String(input.conversationId),
      workflow: "tech-support",
      status: "HUMAN_REVIEW_REQUIRED",
      command: "CreateSupportTicketCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateSupportTicketCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateSupportTicketCommand",
        workflow: "tech-support",
        entityId: String(input.conversationId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateSupportTicketCommandDTO {
    const result = mutationResult as CreateSupportTicketCommandDTO;
    return {
      id: result.id,
      workflow: "tech-support",
      status: "HUMAN_REVIEW_REQUIRED",
      command: "CreateSupportTicketCommand"
    };
  }

  async run(input: CreateSupportTicketCommandInput, context: CommandContext): Promise<CommandResult<CreateSupportTicketCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
