import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateSimplyAccountingExportBatchCommandInput {
  batchNumber: string;
  invoiceIds: string[];
}

export interface CreateSimplyAccountingExportBatchCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "SIMPLY_ACCOUNTING_EXPORT_BATCHED";
  command: "CreateSimplyAccountingExportBatchCommand";
  compatibility: "Simply Accounting / Sage 50 Canada";
}

export class CreateSimplyAccountingExportBatchCommand
  implements GovernedCommand<CreateSimplyAccountingExportBatchCommandInput, CreateSimplyAccountingExportBatchCommandDTO>
{
  validateInput(input: CreateSimplyAccountingExportBatchCommandInput): void {
    if (!input.batchNumber) throw new Error("batchNumber is required.");
    if (!input.invoiceIds?.length) throw new Error("invoiceIds are required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateSimplyAccountingExportBatchCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.create");
  }

  async executeMutation(input: CreateSimplyAccountingExportBatchCommandInput, context: CommandContext): Promise<CreateSimplyAccountingExportBatchCommandDTO> {
    void context;
    return {
      id: `simply-accounting-batch-${input.batchNumber}`,
      workflow: "service-billing",
      status: "SIMPLY_ACCOUNTING_EXPORT_BATCHED",
      command: "CreateSimplyAccountingExportBatchCommand",
      compatibility: "Simply Accounting / Sage 50 Canada"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateSimplyAccountingExportBatchCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateSimplyAccountingExportBatchCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateSimplyAccountingExportBatchCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { batchNumber: input.batchNumber, invoiceIds: input.invoiceIds }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateSimplyAccountingExportBatchCommandDTO {
    return mutationResult as CreateSimplyAccountingExportBatchCommandDTO;
  }

  async run(
    input: CreateSimplyAccountingExportBatchCommandInput,
    context: CommandContext
  ): Promise<CommandResult<CreateSimplyAccountingExportBatchCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
