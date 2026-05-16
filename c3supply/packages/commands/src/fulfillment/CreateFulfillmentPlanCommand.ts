import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateFulfillmentPlanCommandInput { orderId: string; quoteId: string; paymentId?: string; customerId?: string; }
export interface CreateFulfillmentPlanCommandDTO { id: string; workflow: "fulfillment"; status: "FULFILLMENT_PLAN_CREATED"; command: "CreateFulfillmentPlanCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class CreateFulfillmentPlanCommand implements GovernedCommand<CreateFulfillmentPlanCommandInput, CreateFulfillmentPlanCommandDTO> {
  validateInput(input: CreateFulfillmentPlanCommandInput): void {
    if (!input.orderId) throw new Error("orderId is required.");
    if (!input.quoteId) throw new Error("quoteId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateFulfillmentPlanCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.plan.create"); }
  async executeMutation(input: CreateFulfillmentPlanCommandInput, context: CommandContext): Promise<CreateFulfillmentPlanCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "FULFILLMENT_PLAN_CREATED", command: "CreateFulfillmentPlanCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateFulfillmentPlanCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateFulfillmentPlanCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateFulfillmentPlanCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateFulfillmentPlanCommandDTO { return mutationResult as CreateFulfillmentPlanCommandDTO; }
  async run(input: CreateFulfillmentPlanCommandInput, context: CommandContext): Promise<CommandResult<CreateFulfillmentPlanCommandDTO>> { return runGovernedCommand(this, input, context); }
}
