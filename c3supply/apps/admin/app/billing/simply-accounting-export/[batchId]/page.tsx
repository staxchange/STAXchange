import { createPlaceholderFinanceExportScreenModel } from "@stax/finance-export-ui";
import { ExportActionPanel } from "../../../../components/accounting-export/ExportActionPanel";
import { ExportBatchStatusBadge } from "../../../../components/accounting-export/ExportBatchStatusBadge";
import { ExportFileList } from "../../../../components/accounting-export/ExportFileList";
import { ExportHistoryTimeline } from "../../../../components/accounting-export/ExportHistoryTimeline";
import { FinanceApprovalPanel } from "../../../../components/accounting-export/FinanceApprovalPanel";
import { ReconciliationNotePanel } from "../../../../components/accounting-export/ReconciliationNotePanel";
import { SignedDownloadPanel } from "../../../../components/accounting-export/SignedDownloadPanel";

export default async function SimplyAccountingExportBatchReviewPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const model = createPlaceholderFinanceExportScreenModel(batchId);

  return (
    <section>
      <h1>Simply Accounting Export Review</h1>
      <p>
        Finance-only review screen (finance/admin only) for stored export files, signed downloads, reconciliation,
        and manual accounting import outcome.
      </p>

      <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, marginBottom: 18 }}>
        <h2>{model.batch.batchNumber}</h2>
        <ExportBatchStatusBadge status={model.batch.status} />
        <p>Batch ID: {model.batch.id}</p>
        <p>Reviewed by: {model.batch.reviewedBy}</p>
      </article>

      <div style={{ display: "grid", gap: 18 }}>
        <ExportFileList files={model.files} />
        <FinanceApprovalPanel batchId={model.batch.id} />
        <SignedDownloadPanel batchId={model.batch.id} />
        <ExportActionPanel batchId={model.batch.id} />
        <ReconciliationNotePanel batchId={model.batch.id} />
        <ExportHistoryTimeline history={model.history} />
      </div>
    </section>
  );
}
