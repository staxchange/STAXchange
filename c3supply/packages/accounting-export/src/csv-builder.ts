function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function rowsToCsv<T extends object>(
  columns: readonly string[],
  rows: readonly T[]
): string {
  const header = columns.map(escapeCsv).join(",");
  const body = rows.map((row) => {
    const record = row as Record<string, unknown>;
    return columns.map((column) => escapeCsv(record[column])).join(",");
  });

  return [header, ...body].join("\n");
}
