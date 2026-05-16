# Accounting Export File Builder

The accounting export file builder prepares reviewed CSV batch files for **Simply Accounting**.

Compatibility may be described as:

```txt
Simply Accounting / Sage 50 Canada
```

## Boundary

The builder does not:

- directly sync with accounting
- post accounting entries
- auto-approve invoices
- bypass finance review

## Files

The current package produces reviewed CSV batch files:

- customers
- invoices
- invoice lines

The exact import mapping can be tuned after confirming the installed Simply Accounting version and import workflow.
