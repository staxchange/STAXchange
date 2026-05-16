import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkAccountingExportedManuallyCommandInput { handoffId: string; markedBy: string; }
export interface MarkAccountingExportedManuallyCommandDTO { id: string; workflow: "accounting-handoff"; status: "EXPORTED_MANUALLY"; command: "MarkAccountingExportedManuallyCommand"; }
export class MarkAccountingExportedManuallyCommand implements GovernedCommand<MarkAccountingExportedManuallyCommandInput, MarkAccountingExportedManuallyCommandDTO> {
  validateInput(input: MarkAccountingExportedManuallyCommandInput): void {
    if (!(input as any).handoffId) throw new Error("handoffId is required.");
    if (!(input as any).markedBy) throw new Error("markedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkAccountingExportedManuallyCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_export.manual.mark"); }
  async executeMutation(input: MarkAccountingExportedManuallyCommandInput, context: CommandContext): Promise<MarkAccountingExportedManuallyCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "EXPORTED_MANUALLY", command: "MarkAccountingExportedManuallyCommand" };
  }
  async appendAuditEvent(actor: Actor, input: MarkAccountingExportedManuallyCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkAccountingExportedManuallyCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkAccountingExportedManuallyCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkAccountingExportedManuallyCommandDTO { return mutationResult as MarkAccountingExportedManuallyCommandDTO; }
  async run(input: MarkAccountingExportedManuallyCommandInput, context: CommandContext): Promise<CommandResult<MarkAccountingExportedManuallyCommandDTO>> { return runGovernedCommand(this, input, context); }
}
