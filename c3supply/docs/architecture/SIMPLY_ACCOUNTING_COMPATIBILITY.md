# Simply Accounting Compatibility

DWG uses **Simply Accounting**.

Technical compatibility may be described as:

```txt
Simply Accounting / Sage 50 Canada
```

## Export mode

The platform prepares reviewed export batches. It does not directly post or sync to accounting.

## Protected workflow

```txt
invoice approval
→ billing packet
→ Simply Accounting export batch
→ finance review
→ ready for external accounting import/process
```

All protected billing/export mutations route through `packages/commands`.
