# Simply Accounting Storage Next Report

## Added

- `packages/accounting-export-storage`
- storage policy helpers
- signed download policy
- in-memory and Supabase-like export storage repository
- export history events
- reconciliation notes
- finance commands for storage/download/export/reconciliation/archive
- admin API routes for finance actions
- batch review page
- migration `0011_simply_accounting_export_storage_downloads.sql`
- audit script
- tests

## Boundary

This is still finance-reviewed export prep only.

The platform does not:
- directly sync with Simply Accounting
- post accounting entries
- auto-approve invoices
- expose public accounting downloads
