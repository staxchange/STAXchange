import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkSimplyAccountingExportBatchReadyCommandInput {
  batchId: string;
  reviewedBy: string;
}

export interface MarkSimplyAccountingExportBatchReadyCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT";
  command: "MarkSimplyAccountingExportBatchReadyCommand";
}

export class MarkSimplyAccountingExportBatchReadyCommand
  implements GovernedCommand<MarkSimplyAccountingExportBatchReadyCommandInput, MarkSimplyAccountingExportBatchReadyCommandDTO>
{
  validateInput(input: MarkSimplyAccountingExportBatchReadyCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.reviewedBy) throw new Error("reviewedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: MarkSimplyAccountingExportBatchReadyCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: MarkSimplyAccountingExportBatchReadyCommandInput, context: CommandContext): Promise<MarkSimplyAccountingExportBatchReadyCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "service-billing",
      status: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT",
      command: "MarkSimplyAccountingExportBatchReadyCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: MarkSimplyAccountingExportBatchReadyCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as MarkSimplyAccountingExportBatchReadyCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "MarkSimplyAccountingExportBatchReadyCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { reviewedBy: input.reviewedBy }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): MarkSimplyAccountingExportBatchReadyCommandDTO {
    return mutationResult as MarkSimplyAccountingExportBatchReadyCommandDTO;
  }

  async run(
    input: MarkSimplyAccountingExportBatchReadyCommandInput,
    context: CommandContext
  ): Promise<CommandResult<MarkSimplyAccountingExportBatchReadyCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
