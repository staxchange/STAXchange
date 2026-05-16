# Service Interface Full Code Audit

## Result

The treatment systems service interface has been integrated into the STAX Ecommerce Shell + DWG brand dress repository.

## Added

- `packages/service-interface` DTOs, sanitizer, classification rules, SLA rules, checklist templates, and API contracts
- `packages/commands/src/service` protected mutation command stubs
- `packages/workflows/src/definitions/treatment-service.ts` workflow definition
- `apps/storefront/app/service` service request UI
- `apps/storefront/app/api/service-request` governed service request API route
- `apps/storefront/app/api/service-system-lookup` read-only lookup placeholder
- `apps/admin/app/service` admin service queue
- `infra/supabase/migrations/0003_treatment_service_interface.sql` placeholder schema
- `tests/service/service-intake-rules.test.ts`
- `scripts/audit-service-interface.mjs`

## Validation completed

Passed:

```bash
npm install --ignore-scripts --prefer-offline
npm run audit:service
npm run validate:boundaries
npm run test -- --runInBand
npm run typecheck --workspace @stax/service-interface
npm run typecheck --workspace @stax/commands
npm run typecheck --workspace @stax/workflows
npm run typecheck --workspace @stax/storefront
npm run typecheck --workspace @stax/admin
```

Test result:

```txt
6 test suites passed
19 tests passed
```

Build note:

```bash
npm run build --workspace @stax/storefront
npm run build --workspace @stax/admin
```

Both Next.js builds compiled successfully and reached the route manifest/static page generation output in the sandbox. The sandbox process did not exit cleanly before timeout after the manifest output. Re-run these commands in GitHub Actions, local dev, Codespaces, or Vercel.

## Governance boundary

Apps call API routes and command classes. Apps do not directly import Supabase or mutate protected workflow tables.

## Production remaining

- Real Supabase persistence inside service command `executeMutation()` methods
- Real service audit event persistence
- Authenticated admin/service operators
- Technician user model
- Human notification via email, Teams, CRM, or dispatch system
- RLS policies beyond placeholder enablement
- File/photo upload for service requests
- Production rate limiting
