# Finance Export Dashboard Next Report

## Added

- `packages/finance-export-ui`
- finance export status/action policy
- placeholder finance export screen model
- admin batch list/review pages
- finance UI components
- reject download command/API route
- finance review UI migration
- finance export UI tests
- finance export UI audit script

## Workflow supported

```txt
STORED
→ DOWNLOAD_APPROVAL_REQUIRED
→ DOWNLOAD_APPROVED / DOWNLOAD_REJECTED
→ SIGNED_DOWNLOAD_CREATED
→ EXPORTED / FAILED
→ RECONCILIATION_NOTE_ADDED
→ ARCHIVED
```

## Boundary

Finance dashboard does not directly mutate Supabase, does not post to accounting, and does not expose public downloads.
