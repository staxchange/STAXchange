import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface MarkSimplyAccountingExportFailedCommandInput {
  batchId: string;
  failedBy: string;
  reason: string;
}

export interface MarkSimplyAccountingExportFailedCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "FAILED";
  command: "MarkSimplyAccountingExportFailedCommand";
}

export class MarkSimplyAccountingExportFailedCommand implements GovernedCommand<MarkSimplyAccountingExportFailedCommandInput, MarkSimplyAccountingExportFailedCommandDTO> {
  validateInput(input: MarkSimplyAccountingExportFailedCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.failedBy) throw new Error("failedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: MarkSimplyAccountingExportFailedCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: MarkSimplyAccountingExportFailedCommandInput, context: CommandContext): Promise<MarkSimplyAccountingExportFailedCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "FAILED",
      command: "MarkSimplyAccountingExportFailedCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: MarkSimplyAccountingExportFailedCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as MarkSimplyAccountingExportFailedCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "MarkSimplyAccountingExportFailedCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): MarkSimplyAccountingExportFailedCommandDTO {
    return mutationResult as MarkSimplyAccountingExportFailedCommandDTO;
  }

  async run(input: MarkSimplyAccountingExportFailedCommandInput, context: CommandContext): Promise<CommandResult<MarkSimplyAccountingExportFailedCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
