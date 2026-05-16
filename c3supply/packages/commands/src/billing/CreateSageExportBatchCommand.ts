import {
  CreateSimplyAccountingExportBatchCommand,
  type CreateSimplyAccountingExportBatchCommandDTO,
  type CreateSimplyAccountingExportBatchCommandInput
} from "./CreateSimplyAccountingExportBatchCommand";

export type CreateSageExportBatchCommandInput = CreateSimplyAccountingExportBatchCommandInput;
export type CreateSageExportBatchCommandDTO = CreateSimplyAccountingExportBatchCommandDTO;

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
export class CreateSageExportBatchCommand extends CreateSimplyAccountingExportBatchCommand {}
