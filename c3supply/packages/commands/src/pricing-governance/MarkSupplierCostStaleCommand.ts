import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface MarkSupplierCostStaleCommandInput {
  costRecordId: string;
  reason: string;
}

export interface MarkSupplierCostStaleCommandDTO {
  id: string;
  workflow: "pricing-governance";
  status: "COST_STALE";
  command: "MarkSupplierCostStaleCommand";
}

export class MarkSupplierCostStaleCommand implements GovernedCommand<MarkSupplierCostStaleCommandInput, MarkSupplierCostStaleCommandDTO> {
  validateInput(input: MarkSupplierCostStaleCommandInput): void {
    if (!input.costRecordId) throw new Error("costRecordId is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: MarkSupplierCostStaleCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "pricing.supplier_cost.mark_stale");
  }

  private commandEntityId(input: Record<string, unknown>): string {
    if (typeof input.quoteId === "string") return input.quoteId;
    if (typeof input.costRecordId === "string") return input.costRecordId;
    return crypto.randomUUID();
  }

  async executeMutation(input: MarkSupplierCostStaleCommandInput, context: CommandContext): Promise<MarkSupplierCostStaleCommandDTO> {
    void context;
    return {
      id: this.commandEntityId(input as unknown as Record<string, unknown>),
      workflow: "pricing-governance",
      status: "COST_STALE",
      command: "MarkSupplierCostStaleCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: MarkSupplierCostStaleCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as MarkSupplierCostStaleCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "MarkSupplierCostStaleCommand",
        workflow: "pricing-governance",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): MarkSupplierCostStaleCommandDTO {
    return mutationResult as MarkSupplierCostStaleCommandDTO;
  }

  async run(input: MarkSupplierCostStaleCommandInput, context: CommandContext): Promise<CommandResult<MarkSupplierCostStaleCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
