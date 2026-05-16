import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateSupplierCostRecordCommandInput {
  productId: string;
  supplierName: string;
  costCents: number;
  currency: "USD" | "CAD";
  costLevel: "SINGLE_PURCHASE";
}

export interface CreateSupplierCostRecordCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "COST_RECORD_CREATED";
  command: "CreateSupplierCostRecordCommand";
}

export class CreateSupplierCostRecordCommand implements GovernedCommand<CreateSupplierCostRecordCommandInput, CreateSupplierCostRecordCommandDTO> {
  validateInput(input: CreateSupplierCostRecordCommandInput): void {
    if (!input.productId) throw new Error("productId is required.");
    if (!input.supplierName) throw new Error("supplierName is required.");
    if (input.costCents === undefined || input.costCents <= 0) throw new Error("costCents must be positive.");
    if (!input.currency) throw new Error("currency is required.");
    if (!input.costLevel) throw new Error("costLevel is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateSupplierCostRecordCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.supplier_cost.create");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: CreateSupplierCostRecordCommandInput, context: CommandContext): Promise<CreateSupplierCostRecordCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "COST_RECORD_CREATED",
      command: "CreateSupplierCostRecordCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateSupplierCostRecordCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateSupplierCostRecordCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateSupplierCostRecordCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateSupplierCostRecordCommandDTO {
    return mutationResult as CreateSupplierCostRecordCommandDTO;
  }

  async run(input: CreateSupplierCostRecordCommandInput, context: CommandContext): Promise<CommandResult<CreateSupplierCostRecordCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
