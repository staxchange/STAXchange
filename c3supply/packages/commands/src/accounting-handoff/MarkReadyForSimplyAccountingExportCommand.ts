import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkReadyForSimplyAccountingExportCommandInput { handoffId: string; markedBy: string; }
export interface MarkReadyForSimplyAccountingExportCommandDTO { id: string; workflow: "accounting-handoff"; status: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT"; command: "MarkReadyForSimplyAccountingExportCommand"; }
export class MarkReadyForSimplyAccountingExportCommand implements GovernedCommand<MarkReadyForSimplyAccountingExportCommandInput, MarkReadyForSimplyAccountingExportCommandDTO> {
  validateInput(input: MarkReadyForSimplyAccountingExportCommandInput): void {
    if (!(input as any).handoffId) throw new Error("handoffId is required.");
    if (!(input as any).markedBy) throw new Error("markedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkReadyForSimplyAccountingExportCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_export.ready.mark"); }
  async executeMutation(input: MarkReadyForSimplyAccountingExportCommandInput, context: CommandContext): Promise<MarkReadyForSimplyAccountingExportCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT", command: "MarkReadyForSimplyAccountingExportCommand" };
  }
  async appendAuditEvent(actor: Actor, input: MarkReadyForSimplyAccountingExportCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkReadyForSimplyAccountingExportCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkReadyForSimplyAccountingExportCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkReadyForSimplyAccountingExportCommandDTO { return mutationResult as MarkReadyForSimplyAccountingExportCommandDTO; }
  async run(input: MarkReadyForSimplyAccountingExportCommandInput, context: CommandContext): Promise<CommandResult<MarkReadyForSimplyAccountingExportCommandDTO>> { return runGovernedCommand(this, input, context); }
}
