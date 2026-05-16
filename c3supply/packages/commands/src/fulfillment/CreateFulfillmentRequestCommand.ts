import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateFulfillmentRequestCommandInput { fulfillmentPlanId: string; requestedBy: string; }
export interface CreateFulfillmentRequestCommandDTO { id: string; workflow: "fulfillment"; status: "FULFILLMENT_REQUEST_CREATED"; command: "CreateFulfillmentRequestCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class CreateFulfillmentRequestCommand implements GovernedCommand<CreateFulfillmentRequestCommandInput, CreateFulfillmentRequestCommandDTO> {
  validateInput(input: CreateFulfillmentRequestCommandInput): void {
    if (!input.fulfillmentPlanId) throw new Error("fulfillmentPlanId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateFulfillmentRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.request.create"); }
  async executeMutation(input: CreateFulfillmentRequestCommandInput, context: CommandContext): Promise<CreateFulfillmentRequestCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "FULFILLMENT_REQUEST_CREATED", command: "CreateFulfillmentRequestCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateFulfillmentRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateFulfillmentRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateFulfillmentRequestCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateFulfillmentRequestCommandDTO { return mutationResult as CreateFulfillmentRequestCommandDTO; }
  async run(input: CreateFulfillmentRequestCommandInput, context: CommandContext): Promise<CommandResult<CreateFulfillmentRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
