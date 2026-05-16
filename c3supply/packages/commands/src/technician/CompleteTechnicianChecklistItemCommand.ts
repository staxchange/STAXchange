import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CompleteTechnicianChecklistItemCommandInput { workOrderId: string; checklistItemId: string; technicianId: string; value?: string; }

export interface CompleteTechnicianChecklistItemCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "CHECKLIST_ITEM_COMPLETED";
  command: "CompleteTechnicianChecklistItemCommand";
}

export class CompleteTechnicianChecklistItemCommand implements GovernedCommand<CompleteTechnicianChecklistItemCommandInput, CompleteTechnicianChecklistItemCommandDTO> {
  validateInput(input: CompleteTechnicianChecklistItemCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.checklistItemId) throw new Error("checklistItemId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CompleteTechnicianChecklistItemCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.checklist.complete");
  }

  async executeMutation(input: CompleteTechnicianChecklistItemCommandInput, context: CommandContext): Promise<CompleteTechnicianChecklistItemCommandDTO> {
    void context;
    return {
      id: input.checklistItemId,
      workflow: "technician-work-order",
      status: "CHECKLIST_ITEM_COMPLETED",
      command: "CompleteTechnicianChecklistItemCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: CompleteTechnicianChecklistItemCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CompleteTechnicianChecklistItemCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CompleteTechnicianChecklistItemCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CompleteTechnicianChecklistItemCommandDTO {
    return mutationResult as CompleteTechnicianChecklistItemCommandDTO;
  }

  async run(input: CompleteTechnicianChecklistItemCommandInput, context: CommandContext): Promise<CommandResult<CompleteTechnicianChecklistItemCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
