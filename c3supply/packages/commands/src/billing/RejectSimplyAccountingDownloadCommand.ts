import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RejectSimplyAccountingDownloadCommandInput {
  batchId: string;
  rejectedBy: string;
  reason: string;
}

export interface RejectSimplyAccountingDownloadCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "DOWNLOAD_REJECTED";
  command: "RejectSimplyAccountingDownloadCommand";
}

export class RejectSimplyAccountingDownloadCommand
  implements GovernedCommand<RejectSimplyAccountingDownloadCommandInput, RejectSimplyAccountingDownloadCommandDTO>
{
  validateInput(input: RejectSimplyAccountingDownloadCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.rejectedBy) throw new Error("rejectedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RejectSimplyAccountingDownloadCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: RejectSimplyAccountingDownloadCommandInput, context: CommandContext): Promise<RejectSimplyAccountingDownloadCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "DOWNLOAD_REJECTED",
      command: "RejectSimplyAccountingDownloadCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RejectSimplyAccountingDownloadCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RejectSimplyAccountingDownloadCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RejectSimplyAccountingDownloadCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { reason: input.reason }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RejectSimplyAccountingDownloadCommandDTO {
    return mutationResult as RejectSimplyAccountingDownloadCommandDTO;
  }

  async run(input: RejectSimplyAccountingDownloadCommandInput, context: CommandContext): Promise<CommandResult<RejectSimplyAccountingDownloadCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
