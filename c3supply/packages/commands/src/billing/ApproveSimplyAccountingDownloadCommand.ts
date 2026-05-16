import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ApproveSimplyAccountingDownloadCommandInput {
  batchId: string;
  approvedBy: string;
  reason?: string;
}

export interface ApproveSimplyAccountingDownloadCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "DOWNLOAD_APPROVED";
  command: "ApproveSimplyAccountingDownloadCommand";
}

export class ApproveSimplyAccountingDownloadCommand implements GovernedCommand<ApproveSimplyAccountingDownloadCommandInput, ApproveSimplyAccountingDownloadCommandDTO> {
  validateInput(input: ApproveSimplyAccountingDownloadCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveSimplyAccountingDownloadCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: ApproveSimplyAccountingDownloadCommandInput, context: CommandContext): Promise<ApproveSimplyAccountingDownloadCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "DOWNLOAD_APPROVED",
      command: "ApproveSimplyAccountingDownloadCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ApproveSimplyAccountingDownloadCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ApproveSimplyAccountingDownloadCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveSimplyAccountingDownloadCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveSimplyAccountingDownloadCommandDTO {
    return mutationResult as ApproveSimplyAccountingDownloadCommandDTO;
  }

  async run(input: ApproveSimplyAccountingDownloadCommandInput, context: CommandContext): Promise<CommandResult<ApproveSimplyAccountingDownloadCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
