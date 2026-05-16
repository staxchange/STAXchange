import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddTechnicianVisitNoteCommandInput { workOrderId: string; technicianId: string; note: string; }

export interface AddTechnicianVisitNoteCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "FIELD_NOTES_ADDED";
  command: "AddTechnicianVisitNoteCommand";
}

export class AddTechnicianVisitNoteCommand implements GovernedCommand<AddTechnicianVisitNoteCommandInput, AddTechnicianVisitNoteCommandDTO> {
  validateInput(input: AddTechnicianVisitNoteCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.note?.trim()) throw new Error("note is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddTechnicianVisitNoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.note.add");
  }

  async executeMutation(input: AddTechnicianVisitNoteCommandInput, context: CommandContext): Promise<AddTechnicianVisitNoteCommandDTO> {
    void context;
    return {
      id: crypto.randomUUID(),
      workflow: "technician-work-order",
      status: "FIELD_NOTES_ADDED",
      command: "AddTechnicianVisitNoteCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: AddTechnicianVisitNoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AddTechnicianVisitNoteCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddTechnicianVisitNoteCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AddTechnicianVisitNoteCommandDTO {
    return mutationResult as AddTechnicianVisitNoteCommandDTO;
  }

  async run(input: AddTechnicianVisitNoteCommandInput, context: CommandContext): Promise<CommandResult<AddTechnicianVisitNoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
