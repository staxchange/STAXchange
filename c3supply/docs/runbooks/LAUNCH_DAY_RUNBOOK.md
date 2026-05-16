# Launch Day Runbook

## Pre-launch

1. Import final master bundle.
2. Run `npm install`.
3. Run `npm run audit:all`.
4. Run `npm run test -- --runInBand`.
5. Run storefront/admin/customer/technician typechecks.
6. Run storefront build.
7. Confirm `.env.example` has no real secrets.
8. Add secrets to Vercel only.

## Supabase

1. Create Supabase project.
2. Run migrations in order.
3. Create storage buckets.
4. Confirm RLS is enabled.
5. Confirm no public service-role exposure.

## Vercel

1. Deploy storefront.
2. Add `dwgprocesssupply.com`.
3. Verify HTTPS.
4. Run smoke tests.
5. Deploy admin/customer/technician only after auth validation.

## Post-launch

1. Monitor `/api/health`.
2. Monitor `/api/readiness`.
3. Monitor support/service/quote submissions.
4. Monitor auth failures.
5. Monitor Simply Accounting export workflow.
6. Keep rollback option ready.


## Production Integration Phase 1 gate

Run CI production-readiness workflow and ensure auth/session bridge tests pass before deploying internal apps.
