import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AssignSupportTicketCommandInput {
  ticketId: string;
  assigneeId: string;
  note?: string;
}

export interface AssignSupportTicketCommandDTO {
  id: string;
  workflow: "tech-support";
  status: "ASSIGNED";
  command: "AssignSupportTicketCommand";
}

export class AssignSupportTicketCommand implements GovernedCommand<AssignSupportTicketCommandInput, AssignSupportTicketCommandDTO> {
  validateInput(input: AssignSupportTicketCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.ticketId) throw new Error("ticketId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AssignSupportTicketCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "support.ticket.assign");
  }

  async executeMutation(input: AssignSupportTicketCommandInput, context: CommandContext): Promise<AssignSupportTicketCommandDTO> {
    void context;
    // Placeholder only. Production support persistence belongs here and nowhere in apps/*.
    return {
      id: String(input.ticketId),
      workflow: "tech-support",
      status: "ASSIGNED",
      command: "AssignSupportTicketCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AssignSupportTicketCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "AssignSupportTicketCommand",
        workflow: "tech-support",
        entityId: String(input.ticketId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AssignSupportTicketCommandDTO {
    const result = mutationResult as AssignSupportTicketCommandDTO;
    return {
      id: result.id,
      workflow: "tech-support",
      status: "ASSIGNED",
      command: "AssignSupportTicketCommand"
    };
  }

  async run(input: AssignSupportTicketCommandInput, context: CommandContext): Promise<CommandResult<AssignSupportTicketCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
