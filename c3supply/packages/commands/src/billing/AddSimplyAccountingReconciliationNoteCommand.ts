import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface AddSimplyAccountingReconciliationNoteCommandInput {
  batchId: string;
  note: string;
  createdBy: string;
}

export interface AddSimplyAccountingReconciliationNoteCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "RECONCILIATION_NOTE_ADDED";
  command: "AddSimplyAccountingReconciliationNoteCommand";
}

export class AddSimplyAccountingReconciliationNoteCommand implements GovernedCommand<AddSimplyAccountingReconciliationNoteCommandInput, AddSimplyAccountingReconciliationNoteCommandDTO> {
  validateInput(input: AddSimplyAccountingReconciliationNoteCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.note) throw new Error("note is required.");
    if (!input.createdBy) throw new Error("createdBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddSimplyAccountingReconciliationNoteCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: AddSimplyAccountingReconciliationNoteCommandInput, context: CommandContext): Promise<AddSimplyAccountingReconciliationNoteCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "RECONCILIATION_NOTE_ADDED",
      command: "AddSimplyAccountingReconciliationNoteCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AddSimplyAccountingReconciliationNoteCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as AddSimplyAccountingReconciliationNoteCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddSimplyAccountingReconciliationNoteCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AddSimplyAccountingReconciliationNoteCommandDTO {
    return mutationResult as AddSimplyAccountingReconciliationNoteCommandDTO;
  }

  async run(input: AddSimplyAccountingReconciliationNoteCommandInput, context: CommandContext): Promise<CommandResult<AddSimplyAccountingReconciliationNoteCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
