import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ArchiveSimplyAccountingExportBatchCommandInput {
  batchId: string;
  archivedBy: string;
  reason?: string;
}

export interface ArchiveSimplyAccountingExportBatchCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "ARCHIVED";
  command: "ArchiveSimplyAccountingExportBatchCommand";
}

export class ArchiveSimplyAccountingExportBatchCommand implements GovernedCommand<ArchiveSimplyAccountingExportBatchCommandInput, ArchiveSimplyAccountingExportBatchCommandDTO> {
  validateInput(input: ArchiveSimplyAccountingExportBatchCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.archivedBy) throw new Error("archivedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ArchiveSimplyAccountingExportBatchCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: ArchiveSimplyAccountingExportBatchCommandInput, context: CommandContext): Promise<ArchiveSimplyAccountingExportBatchCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "ARCHIVED",
      command: "ArchiveSimplyAccountingExportBatchCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ArchiveSimplyAccountingExportBatchCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ArchiveSimplyAccountingExportBatchCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ArchiveSimplyAccountingExportBatchCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ArchiveSimplyAccountingExportBatchCommandDTO {
    return mutationResult as ArchiveSimplyAccountingExportBatchCommandDTO;
  }

  async run(input: ArchiveSimplyAccountingExportBatchCommandInput, context: CommandContext): Promise<CommandResult<ArchiveSimplyAccountingExportBatchCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
