import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ExportSageBatchCommandInput {
  batchName: string;
  note?: string;
}

export interface ExportSageBatchCommandDTO {
  id: string;
  workflow: "sage-export";
  status: "BATCH_CREATED";
  command: "ExportSageBatchCommand";
}

export class ExportSageBatchCommand implements GovernedCommand<ExportSageBatchCommandInput, ExportSageBatchCommandDTO> {
  validateInput(input: ExportSageBatchCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.batchName) throw new Error("batchName is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ExportSageBatchCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "ops.sage_export");
  }

  async executeMutation(input: ExportSageBatchCommandInput, context: CommandContext): Promise<ExportSageBatchCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.batchName),
      workflow: "sage-export",
      status: "BATCH_CREATED",
      command: "ExportSageBatchCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ExportSageBatchCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "ExportSageBatchCommand",
        workflow: "sage-export",
        entityId: String(input.batchName),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ExportSageBatchCommandDTO {
    const result = mutationResult as ExportSageBatchCommandDTO;
    return {
      id: result.id,
      workflow: "sage-export",
      status: "BATCH_CREATED",
      command: "ExportSageBatchCommand"
    };
  }

  async run(input: ExportSageBatchCommandInput, context: CommandContext): Promise<CommandResult<ExportSageBatchCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
