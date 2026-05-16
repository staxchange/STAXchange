import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordTaxFreightPlaceholderCommandInput { invoiceId: string; taxPlaceholderCents: number; freightPlaceholderCents: number; recordedBy: string; }
export interface RecordTaxFreightPlaceholderCommandDTO { id: string; workflow: "commerce-billing"; status: "TAX_FREIGHT_REVIEW_REQUIRED"; command: "RecordTaxFreightPlaceholderCommand"; }
export class RecordTaxFreightPlaceholderCommand implements GovernedCommand<RecordTaxFreightPlaceholderCommandInput, RecordTaxFreightPlaceholderCommandDTO> {
  validateInput(input: RecordTaxFreightPlaceholderCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if ((input as any).taxPlaceholderCents === undefined || (input as any).taxPlaceholderCents < 0) throw new Error("taxPlaceholderCents is required.");
    if ((input as any).freightPlaceholderCents === undefined || (input as any).freightPlaceholderCents < 0) throw new Error("freightPlaceholderCents is required.");
    if (!(input as any).recordedBy) throw new Error("recordedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordTaxFreightPlaceholderCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_tax_freight.placeholder.record"); }
  async executeMutation(input: RecordTaxFreightPlaceholderCommandInput, context: CommandContext): Promise<RecordTaxFreightPlaceholderCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "TAX_FREIGHT_REVIEW_REQUIRED", command: "RecordTaxFreightPlaceholderCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordTaxFreightPlaceholderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordTaxFreightPlaceholderCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordTaxFreightPlaceholderCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordTaxFreightPlaceholderCommandDTO { return mutationResult as RecordTaxFreightPlaceholderCommandDTO; }
  async run(input: RecordTaxFreightPlaceholderCommandInput, context: CommandContext): Promise<CommandResult<RecordTaxFreightPlaceholderCommandDTO>> { return runGovernedCommand(this, input, context); }
}
