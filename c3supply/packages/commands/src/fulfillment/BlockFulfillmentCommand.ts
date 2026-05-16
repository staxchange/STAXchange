import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface BlockFulfillmentCommandInput { fulfillmentId: string; blockedBy: string; reason: string; }
export interface BlockFulfillmentCommandDTO { id: string; workflow: "fulfillment"; status: "FULFILLMENT_BLOCKED"; command: "BlockFulfillmentCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class BlockFulfillmentCommand implements GovernedCommand<BlockFulfillmentCommandInput, BlockFulfillmentCommandDTO> {
  validateInput(input: BlockFulfillmentCommandInput): void {
    if (!input.fulfillmentId) throw new Error("fulfillmentId is required.");
    if (!input.blockedBy) throw new Error("blockedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: BlockFulfillmentCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.block"); }
  async executeMutation(input: BlockFulfillmentCommandInput, context: CommandContext): Promise<BlockFulfillmentCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "FULFILLMENT_BLOCKED", command: "BlockFulfillmentCommand" }; }
  async appendAuditEvent(actor: Actor, input: BlockFulfillmentCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as BlockFulfillmentCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "BlockFulfillmentCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): BlockFulfillmentCommandDTO { return mutationResult as BlockFulfillmentCommandDTO; }
  async run(input: BlockFulfillmentCommandInput, context: CommandContext): Promise<CommandResult<BlockFulfillmentCommandDTO>> { return runGovernedCommand(this, input, context); }
}
