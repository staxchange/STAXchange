import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateSimplyAccountingSignedDownloadCommandInput {
  batchId: string;
  fileId: string;
  url: string;
  expiresAt: string;
}

export interface CreateSimplyAccountingSignedDownloadCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "SIGNED_DOWNLOAD_CREATED";
  command: "CreateSimplyAccountingSignedDownloadCommand";
}

export class CreateSimplyAccountingSignedDownloadCommand implements GovernedCommand<CreateSimplyAccountingSignedDownloadCommandInput, CreateSimplyAccountingSignedDownloadCommandDTO> {
  validateInput(input: CreateSimplyAccountingSignedDownloadCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.fileId) throw new Error("fileId is required.");
    if (!input.url) throw new Error("url is required.");
    if (!input.expiresAt) throw new Error("expiresAt is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateSimplyAccountingSignedDownloadCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: CreateSimplyAccountingSignedDownloadCommandInput, context: CommandContext): Promise<CreateSimplyAccountingSignedDownloadCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "SIGNED_DOWNLOAD_CREATED",
      command: "CreateSimplyAccountingSignedDownloadCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateSimplyAccountingSignedDownloadCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateSimplyAccountingSignedDownloadCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateSimplyAccountingSignedDownloadCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateSimplyAccountingSignedDownloadCommandDTO {
    return mutationResult as CreateSimplyAccountingSignedDownloadCommandDTO;
  }

  async run(input: CreateSimplyAccountingSignedDownloadCommandInput, context: CommandContext): Promise<CommandResult<CreateSimplyAccountingSignedDownloadCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
