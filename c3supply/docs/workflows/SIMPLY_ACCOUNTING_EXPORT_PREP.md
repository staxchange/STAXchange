# Simply Accounting Export Prep

DWG uses **Simply Accounting** for accounting workflow compatibility.

This repo prepares finance-reviewed export batches only.

## Compatibility language

Use this when technical compatibility needs to be clear:

```txt
Simply Accounting / Sage 50 Canada
```

## Boundary

The system does not:

- directly sync to accounting
- post accounting entries
- auto-approve invoices
- bypass finance review

## Workflow

```txt
INVOICE_APPROVED
→ BILLING_PACKET_CREATED
→ SIMPLY_ACCOUNTING_EXPORT_BATCHED
→ READY_FOR_SIMPLY_ACCOUNTING_EXPORT
```
