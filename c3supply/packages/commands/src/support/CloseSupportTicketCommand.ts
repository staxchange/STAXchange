import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CloseSupportTicketCommandInput {
  ticketId: string;
  resolution: string;
  note?: string;
}

export interface CloseSupportTicketCommandDTO {
  id: string;
  workflow: "tech-support";
  status: "CLOSED";
  command: "CloseSupportTicketCommand";
}

export class CloseSupportTicketCommand implements GovernedCommand<CloseSupportTicketCommandInput, CloseSupportTicketCommandDTO> {
  validateInput(input: CloseSupportTicketCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.ticketId) throw new Error("ticketId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CloseSupportTicketCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "support.ticket.close");
  }

  async executeMutation(input: CloseSupportTicketCommandInput, context: CommandContext): Promise<CloseSupportTicketCommandDTO> {
    void context;
    // Placeholder only. Production support persistence belongs here and nowhere in apps/*.
    return {
      id: String(input.ticketId),
      workflow: "tech-support",
      status: "CLOSED",
      command: "CloseSupportTicketCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CloseSupportTicketCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "CloseSupportTicketCommand",
        workflow: "tech-support",
        entityId: String(input.ticketId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CloseSupportTicketCommandDTO {
    const result = mutationResult as CloseSupportTicketCommandDTO;
    return {
      id: result.id,
      workflow: "tech-support",
      status: "CLOSED",
      command: "CloseSupportTicketCommand"
    };
  }

  async run(input: CloseSupportTicketCommandInput, context: CommandContext): Promise<CommandResult<CloseSupportTicketCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
