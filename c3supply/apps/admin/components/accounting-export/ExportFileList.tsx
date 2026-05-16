import type { FinanceExportFileView } from "@stax/finance-export-ui";

export function ExportFileList({ files }: { files: FinanceExportFileView[] }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2>Stored export files</h2>
      {files.map((file) => (
        <article
          key={file.id}
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 16
          }}
        >
          <strong>{file.fileName}</strong>
          <p>Kind: {file.fileKind}</p>
          <p>Rows: {file.rowCount}</p>
          <p>Path: {file.storagePath}</p>
        </article>
      ))}
    </section>
  );
}
