import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddAccountingReconciliationNoteCommandInput { handoffId: string; note: string; createdBy: string; }
export interface AddAccountingReconciliationNoteCommandDTO { id: string; workflow: "accounting-handoff"; status: "RECONCILED"; command: "AddAccountingReconciliationNoteCommand"; }
export class AddAccountingReconciliationNoteCommand implements GovernedCommand<AddAccountingReconciliationNoteCommandInput, AddAccountingReconciliationNoteCommandDTO> {
  validateInput(input: AddAccountingReconciliationNoteCommandInput): void {
    if (!(input as any).handoffId) throw new Error("handoffId is required.");
    if (!(input as any).note) throw new Error("note is required.");
    if (!(input as any).createdBy) throw new Error("createdBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AddAccountingReconciliationNoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_reconciliation.note.add"); }
  async executeMutation(input: AddAccountingReconciliationNoteCommandInput, context: CommandContext): Promise<AddAccountingReconciliationNoteCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "RECONCILED", command: "AddAccountingReconciliationNoteCommand" };
  }
  async appendAuditEvent(actor: Actor, input: AddAccountingReconciliationNoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AddAccountingReconciliationNoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AddAccountingReconciliationNoteCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AddAccountingReconciliationNoteCommandDTO { return mutationResult as AddAccountingReconciliationNoteCommandDTO; }
  async run(input: AddAccountingReconciliationNoteCommandInput, context: CommandContext): Promise<CommandResult<AddAccountingReconciliationNoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
