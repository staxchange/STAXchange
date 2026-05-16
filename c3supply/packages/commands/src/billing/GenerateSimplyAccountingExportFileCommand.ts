import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface GenerateSimplyAccountingExportFileCommandInput {
  batchId: string;
  generatedBy: string;
}

export interface GenerateSimplyAccountingExportFileCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "FILE_GENERATED";
  command: "GenerateSimplyAccountingExportFileCommand";
}

export class GenerateSimplyAccountingExportFileCommand
  implements GovernedCommand<GenerateSimplyAccountingExportFileCommandInput, GenerateSimplyAccountingExportFileCommandDTO>
{
  validateInput(input: GenerateSimplyAccountingExportFileCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.generatedBy) throw new Error("generatedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: GenerateSimplyAccountingExportFileCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: GenerateSimplyAccountingExportFileCommandInput, context: CommandContext): Promise<GenerateSimplyAccountingExportFileCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "service-billing",
      status: "FILE_GENERATED",
      command: "GenerateSimplyAccountingExportFileCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: GenerateSimplyAccountingExportFileCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as GenerateSimplyAccountingExportFileCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "GenerateSimplyAccountingExportFileCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { generatedBy: input.generatedBy }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): GenerateSimplyAccountingExportFileCommandDTO {
    return mutationResult as GenerateSimplyAccountingExportFileCommandDTO;
  }

  async run(
    input: GenerateSimplyAccountingExportFileCommandInput,
    context: CommandContext
  ): Promise<CommandResult<GenerateSimplyAccountingExportFileCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
