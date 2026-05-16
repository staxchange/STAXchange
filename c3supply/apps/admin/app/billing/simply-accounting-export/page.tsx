import { createPlaceholderFinanceExportScreenModel } from "@stax/finance-export-ui";
import { ExportBatchStatusBadge } from "../../../components/accounting-export/ExportBatchStatusBadge";

export default function SimplyAccountingExportDashboardPage() {
  const model = createPlaceholderFinanceExportScreenModel();

  return (
    <section>
      <h1>Simply Accounting Export Dashboard</h1>
      <p>
        Finance-reviewed export batches for manual Simply Accounting / Sage 50 Canada review/import.
        No direct accounting sync is performed.
      </p>

      <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 }}>
        <h2>{model.batch.batchNumber}</h2>
        <ExportBatchStatusBadge status={model.batch.status} />
        <p>Invoices: {model.batch.invoiceCount}</p>
        <p>Files: {model.batch.fileCount}</p>
        <a href={`/billing/simply-accounting-export/${model.batch.id}`}>Review batch →</a>
      </article>
    </section>
  );
}
