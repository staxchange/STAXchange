import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RecordInventoryAdjustmentCommandInput {
  workOrderId: string;
  sku?: string;
  productId?: string;
  quantityDelta: number;
  reason: string;
}

export interface RecordInventoryAdjustmentCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "INVENTORY_ADJUSTMENT_RECORDED";
  command: "RecordInventoryAdjustmentCommand";
}

export class RecordInventoryAdjustmentCommand implements GovernedCommand<RecordInventoryAdjustmentCommandInput, RecordInventoryAdjustmentCommandDTO> {
  validateInput(input: RecordInventoryAdjustmentCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.reason) throw new Error("reason is required.");
    if ("quantity" in input && typeof input.quantity === "number" && input.quantity <= 0) throw new Error("quantity must be positive.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RecordInventoryAdjustmentCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "inventory.adjustment.record");
  }

  async executeMutation(input: RecordInventoryAdjustmentCommandInput, context: CommandContext): Promise<RecordInventoryAdjustmentCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.workOrderId,
      workflow: "service-billing",
      status: "INVENTORY_ADJUSTMENT_RECORDED",
      command: "RecordInventoryAdjustmentCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RecordInventoryAdjustmentCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RecordInventoryAdjustmentCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RecordInventoryAdjustmentCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RecordInventoryAdjustmentCommandDTO {
    return mutationResult as RecordInventoryAdjustmentCommandDTO;
  }

  async run(input: RecordInventoryAdjustmentCommandInput, context: CommandContext): Promise<CommandResult<RecordInventoryAdjustmentCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
