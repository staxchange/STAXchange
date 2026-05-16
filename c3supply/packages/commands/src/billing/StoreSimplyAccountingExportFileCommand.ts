import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface StoreSimplyAccountingExportFileCommandInput {
  batchId: string;
  fileName: string;
  fileKind: "CUSTOMERS_CSV" | "INVOICES_CSV" | "INVOICE_LINES_CSV" | "MANIFEST_JSON";
  storageBucket: string;
  storagePath: string;
  rowCount: number;
}

export interface StoreSimplyAccountingExportFileCommandDTO {
  id: string;
  workflow: "simply-accounting-export-storage";
  status: "STORED";
  command: "StoreSimplyAccountingExportFileCommand";
}

export class StoreSimplyAccountingExportFileCommand implements GovernedCommand<StoreSimplyAccountingExportFileCommandInput, StoreSimplyAccountingExportFileCommandDTO> {
  validateInput(input: StoreSimplyAccountingExportFileCommandInput): void {
    if (!input.batchId) throw new Error("batchId is required.");
    if (!input.fileName) throw new Error("fileName is required.");
    if (!input.fileKind) throw new Error("fileKind is required.");
    if (!input.storageBucket) throw new Error("storageBucket is required.");
    if (!input.storagePath) throw new Error("storagePath is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: StoreSimplyAccountingExportFileCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "billing.sage_batch.mark_ready");
  }

  async executeMutation(input: StoreSimplyAccountingExportFileCommandInput, context: CommandContext): Promise<StoreSimplyAccountingExportFileCommandDTO> {
    void context;
    return {
      id: input.batchId,
      workflow: "simply-accounting-export-storage",
      status: "STORED",
      command: "StoreSimplyAccountingExportFileCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: StoreSimplyAccountingExportFileCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as StoreSimplyAccountingExportFileCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "StoreSimplyAccountingExportFileCommand",
        workflow: "simply-accounting-export-storage",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): StoreSimplyAccountingExportFileCommandDTO {
    return mutationResult as StoreSimplyAccountingExportFileCommandDTO;
  }

  async run(input: StoreSimplyAccountingExportFileCommandInput, context: CommandContext): Promise<CommandResult<StoreSimplyAccountingExportFileCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
