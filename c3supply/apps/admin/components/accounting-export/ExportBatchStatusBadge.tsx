import { financeExportStatusLabel, financeExportStatusSeverity } from "@stax/finance-export-ui";

export function ExportBatchStatusBadge({ status }: { status: string }) {
  const severity = financeExportStatusSeverity(status);

  return (
    <span
      style={{
        display: "inline-flex",
        borderRadius: 999,
        padding: "6px 10px",
        fontWeight: 800,
        border: "1px solid #cbd5e1",
        background:
          severity === "success"
            ? "#dcfce7"
            : severity === "warning"
              ? "#fef3c7"
              : severity === "danger"
                ? "#fee2e2"
                : "#f1f5f9"
      }}
    >
      {financeExportStatusLabel(status)}
    </span>
  );
}
