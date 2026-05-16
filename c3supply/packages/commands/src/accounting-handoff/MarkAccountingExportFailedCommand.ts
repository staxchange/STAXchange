import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkAccountingExportFailedCommandInput { handoffId: string; reason: string; markedBy: string; }
export interface MarkAccountingExportFailedCommandDTO { id: string; workflow: "accounting-handoff"; status: "EXPORT_FAILED"; command: "MarkAccountingExportFailedCommand"; }
export class MarkAccountingExportFailedCommand implements GovernedCommand<MarkAccountingExportFailedCommandInput, MarkAccountingExportFailedCommandDTO> {
  validateInput(input: MarkAccountingExportFailedCommandInput): void {
    if (!(input as any).handoffId) throw new Error("handoffId is required.");
    if (!(input as any).reason) throw new Error("reason is required.");
    if (!(input as any).markedBy) throw new Error("markedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkAccountingExportFailedCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_export.failed.mark"); }
  async executeMutation(input: MarkAccountingExportFailedCommandInput, context: CommandContext): Promise<MarkAccountingExportFailedCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "EXPORT_FAILED", command: "MarkAccountingExportFailedCommand" };
  }
  async appendAuditEvent(actor: Actor, input: MarkAccountingExportFailedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkAccountingExportFailedCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkAccountingExportFailedCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkAccountingExportFailedCommandDTO { return mutationResult as MarkAccountingExportFailedCommandDTO; }
  async run(input: MarkAccountingExportFailedCommandInput, context: CommandContext): Promise<CommandResult<MarkAccountingExportFailedCommandDTO>> { return runGovernedCommand(this, input, context); }
}
