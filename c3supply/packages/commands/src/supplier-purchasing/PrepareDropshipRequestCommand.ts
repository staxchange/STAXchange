import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface PrepareDropshipRequestCommandInput { supplierPoId: string; supplierName: string; preparedBy: string; }
export interface PrepareDropshipRequestCommandDTO { id: string; workflow: "supplier-purchasing"; status: "DROPSHIP_REQUEST_PREPARED"; command: "PrepareDropshipRequestCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class PrepareDropshipRequestCommand implements GovernedCommand<PrepareDropshipRequestCommandInput, PrepareDropshipRequestCommandDTO> {
  validateInput(input: PrepareDropshipRequestCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.supplierName) throw new Error("supplierName is required.");
    if (!input.preparedBy) throw new Error("preparedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: PrepareDropshipRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "dropship.request.prepare"); }
  async executeMutation(input: PrepareDropshipRequestCommandInput, context: CommandContext): Promise<PrepareDropshipRequestCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "DROPSHIP_REQUEST_PREPARED", command: "PrepareDropshipRequestCommand" }; }
  async appendAuditEvent(actor: Actor, input: PrepareDropshipRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as PrepareDropshipRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "PrepareDropshipRequestCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): PrepareDropshipRequestCommandDTO { return mutationResult as PrepareDropshipRequestCommandDTO; }
  async run(input: PrepareDropshipRequestCommandInput, context: CommandContext): Promise<CommandResult<PrepareDropshipRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
