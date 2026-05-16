# Simply Accounting Export Next Checkpoint

## Added

- `packages/accounting-export`
- new Simply Accounting export commands
- backward-compatible legacy command aliases
- export CSV builder
- export batch manifest builder
- admin export preview page
- admin export file API route
- migration `0010_simply_accounting_export_files.sql`
- accounting export audit script
- accounting export tests

## Boundary

This does not directly sync with accounting. It prepares finance-reviewed CSV batch files only.

## Compatibility

Temporary aliases remain:

- `CreateSageExportBatchCommand`
- `MarkSageExportBatchReadyCommand`

They point to the new Simply Accounting commands for compatibility while future code references migrate.
