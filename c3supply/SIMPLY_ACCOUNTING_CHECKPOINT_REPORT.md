# Simply Accounting Checkpoint Report

## Verdict

Accounting/export language has been patched from Sage-first wording to Simply Accounting-first wording.

## Standardized terms

| Concept | Standard |
|---|---|
| Business software | Simply Accounting |
| Compatibility note | Simply Accounting / Sage 50 Canada |
| Workflow | Simply Accounting export prep |
| Batch | Simply Accounting export batch |
| Ready status | READY_FOR_SIMPLY_ACCOUNTING_EXPORT |
| Batched status | SIMPLY_ACCOUNTING_EXPORT_BATCHED |

## Boundary

This remains finance-reviewed export preparation only.

The repo must not:
- directly sync to accounting
- post accounting entries
- auto-approve invoices
- bypass finance review
- bypass `packages/commands`

## Compatibility

Some class/file names such as `CreateSageExportBatchCommand` may remain as backward-compatible internal identifiers until a deeper rename migration is scheduled.
