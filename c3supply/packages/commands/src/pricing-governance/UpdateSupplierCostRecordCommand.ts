import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface UpdateSupplierCostRecordCommandInput {
  costRecordId: string;
  costCents: number;
  currency: "USD" | "CAD";
}

export interface UpdateSupplierCostRecordCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "COST_VALIDATED";
  command: "UpdateSupplierCostRecordCommand";
}

export class UpdateSupplierCostRecordCommand implements GovernedCommand<UpdateSupplierCostRecordCommandInput, UpdateSupplierCostRecordCommandDTO> {
  validateInput(input: UpdateSupplierCostRecordCommandInput): void {
    if (!input.costRecordId) throw new Error("costRecordId is required.");
    if (input.costCents === undefined || input.costCents <= 0) throw new Error("costCents must be positive.");
    if (!input.currency) throw new Error("currency is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: UpdateSupplierCostRecordCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.supplier_cost.update");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: UpdateSupplierCostRecordCommandInput, context: CommandContext): Promise<UpdateSupplierCostRecordCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "COST_VALIDATED",
      command: "UpdateSupplierCostRecordCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: UpdateSupplierCostRecordCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as UpdateSupplierCostRecordCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "UpdateSupplierCostRecordCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): UpdateSupplierCostRecordCommandDTO {
    return mutationResult as UpdateSupplierCostRecordCommandDTO;
  }

  async run(input: UpdateSupplierCostRecordCommandInput, context: CommandContext): Promise<CommandResult<UpdateSupplierCostRecordCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
