# Service Production Wiring Audit

## Completed

- Supabase service-role client factory
- SupabaseServiceRepository for real service request, triage, escalation, work-order, scheduling, assignment, visit-completion reads/writes
- SupabaseAuditSink for immutable audit insertion
- service-role-only adapter wiring through command context
- admin authentication helper using Supabase Auth profile/service role lookup
- technician table/model and admin technician API
- hardened service RLS policy migration
- Teams/email/CRM webhook notification fanout
- service rate limiting
- signed upload URL endpoints for service attachments
- file/photo upload schema placeholders
- production docs and tests

## Validation commands passed

```bash
npm run audit:service
npm run validate:boundaries
npm run typecheck --workspace @stax/service-interface
npm run typecheck --workspace @stax/commands
npm run typecheck --workspace @stax/workflows
npm run typecheck --workspace @stax/storefront
npm run typecheck --workspace @stax/admin
npm run test -- --runInBand
```

Test result:

```txt
12 test suites passed
28 tests passed
```

## Build note

Storefront and admin Next.js builds both compiled successfully and reached static generation/build trace collection in the sandbox. The sandbox process timed out before Next.js fully exited. Re-run in CI/Vercel/local:

```bash
npm run build --workspace @stax/storefront
npm run build --workspace @stax/admin
```

## Still required for real production

- Set real Supabase env vars in Vercel
- Run migrations 0003 through 0006
- Configure Supabase Auth user app_metadata.role values
- Configure Teams/email/CRM webhook destinations
- Verify RLS with real users
- Replace in-memory rate limiter with shared production limiter for high volume
