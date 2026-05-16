# Billing / Inventory / Simply Accounting Next-5 Report

## Added

- `packages/service-billing`
- `packages/parts-inventory`
- `packages/commands/src/billing`
- admin billing dashboard/routes/API placeholders
- technician labor and parts pages
- service billing workflow
- Supabase billing/inventory/Simply Accounting prep migration
- billing tests
- billing audit script
- governance permissions including FINANCE role

## Workflow

```txt
SERVICE_CLOSEOUT_APPROVED
→ LABOR_RECORDED
→ PARTS_RECORDED
→ INVOICE_DRAFT_CREATED
→ INVOICE_REVIEW_REQUIRED
→ INVOICE_APPROVED
→ BILLING_PACKET_CREATED
→ SIMPLY_ACCOUNTING_EXPORT_BATCHED
→ READY_FOR_SIMPLY_ACCOUNTING_EXPORT
```

## Boundary

No app route should directly mutate Supabase or directly sync to Simply Accounting. Commands remain the protected mutation gateway.

## Validation

This artifact includes tests and audit scripts. Re-run validation after import into GitHub/Codespaces.
