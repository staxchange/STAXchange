# Service Production Persistence Report

Implemented the production wiring layer requested for the DWG Treatment Systems Service Interface.

## Implemented

- SupabaseServiceRepository
- service-role-only server adapter
- real inserts into service_requests
- real updates for triage, emergency escalation, work order creation, scheduling, technician assignment, and service completion
- SupabaseAuditSink for real audit event persistence
- admin authentication helper using Supabase Auth token + service_profiles role table
- technician profile/table model
- RLS policy hardening migration
- multi-destination notification adapter for Teams/email/CRM/webhooks
- service request rate limiting
- signed upload URL support for service photos, water tests, and work order documents
- service upload tracking table
- admin service queue API
- production service audit script
- production adapter tests

## Commands validated

```bash
npm install --ignore-scripts --no-audit --no-fund
npm run audit:service
npm run audit:service:prod
npm run validate:boundaries
npm run test -- --runInBand
npm run typecheck --workspace @stax/service-interface
npm run typecheck --workspace @stax/commands
npm run typecheck --workspace @stax/storefront
npm run typecheck --workspace @stax/admin
```

## Test result

```txt
12 test suites passed
28 tests passed
```

## Build note

`npm run build --workspace @stax/storefront` compiled successfully and reached page-data collection in this sandbox, but the sandbox timed out before the process fully exited. Re-run storefront/admin builds in GitHub Actions, Codespaces, local, or Vercel.

## Remaining production setup

- Apply Supabase migrations.
- Add Vercel env vars.
- Create service_profiles rows for OPS/ADMIN/SUPER_ADMIN users.
- Configure Teams/email/CRM webhook destinations.
- Replace in-memory rate limiting with durable Redis/KV for high-volume production.
- Add malware scanning/file-size enforcement at the upload destination if required.
