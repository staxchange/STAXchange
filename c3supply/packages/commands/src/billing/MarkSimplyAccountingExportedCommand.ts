import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface MarkSimplyAccountingExportedCommandInput {
  batchId: string;
  exportedBy: string;
  note?: string;
}

export interface MarkSimplyAccountingExportedCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "EXPORTED";
  command: "MarkSimplyAccountingExportedCommand";
}

export class MarkSimplyAccountingExportedCommand implements GovernedCommand<MarkSimplyAccountingExportedCommandInput, MarkSimplyAccountingExportedCommandDTO> {
  validateInput(input: MarkSimplyAccountingExportedCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.exportedBy) throw new Error("exportedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: MarkSimplyAccountingExportedCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: MarkSimplyAccountingExportedCommandInput, context: CommandContext): Promise<MarkSimplyAccountingExportedCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "EXPORTED",
      command: "MarkSimplyAccountingExportedCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: MarkSimplyAccountingExportedCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as MarkSimplyAccountingExportedCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "MarkSimplyAccountingExportedCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): MarkSimplyAccountingExportedCommandDTO {
    return mutationResult as MarkSimplyAccountingExportedCommandDTO;
  }

  async run(input: MarkSimplyAccountingExportedCommandInput, context: CommandContext): Promise<CommandResult<MarkSimplyAccountingExportedCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
