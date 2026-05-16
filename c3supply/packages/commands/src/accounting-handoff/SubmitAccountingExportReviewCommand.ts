import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitAccountingExportReviewCommandInput { handoffId: string; submittedBy: string; }
export interface SubmitAccountingExportReviewCommandDTO { id: string; workflow: "accounting-handoff"; status: "EXPORT_REVIEW_REQUIRED"; command: "SubmitAccountingExportReviewCommand"; }
export class SubmitAccountingExportReviewCommand implements GovernedCommand<SubmitAccountingExportReviewCommandInput, SubmitAccountingExportReviewCommandDTO> {
  validateInput(input: SubmitAccountingExportReviewCommandInput): void {
    if (!(input as any).handoffId) throw new Error("handoffId is required.");
    if (!(input as any).submittedBy) throw new Error("submittedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SubmitAccountingExportReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "accounting_export.review.submit"); }
  async executeMutation(input: SubmitAccountingExportReviewCommandInput, context: CommandContext): Promise<SubmitAccountingExportReviewCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "accounting-handoff", status: "EXPORT_REVIEW_REQUIRED", command: "SubmitAccountingExportReviewCommand" };
  }
  async appendAuditEvent(actor: Actor, input: SubmitAccountingExportReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitAccountingExportReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SubmitAccountingExportReviewCommand", workflow: "accounting-handoff", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SubmitAccountingExportReviewCommandDTO { return mutationResult as SubmitAccountingExportReviewCommandDTO; }
  async run(input: SubmitAccountingExportReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitAccountingExportReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
