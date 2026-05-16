import {
  MarkSimplyAccountingExportBatchReadyCommand,
  type MarkSimplyAccountingExportBatchReadyCommandDTO,
  type MarkSimplyAccountingExportBatchReadyCommandInput
} from "./MarkSimplyAccountingExportBatchReadyCommand";

export type MarkSageExportBatchReadyCommandInput = MarkSimplyAccountingExportBatchReadyCommandInput;
export type MarkSageExportBatchReadyCommandDTO = MarkSimplyAccountingExportBatchReadyCommandDTO;

/**
 * Backward-compatible command wrapper for legacy imports.
 *
 * The inherited lifecycle methods are:
 * validateInput()
 * validateActor()
 * governanceGuard()
 * executeMutation()
 * appendAuditEvent()
 * returnSafeDTO()
 * run()
 */
export class MarkSageExportBatchReadyCommand extends MarkSimplyAccountingExportBatchReadyCommand {}
