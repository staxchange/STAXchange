# Production Integration Phase 1

This phase hardens production integration without deploying.

## Added/hardened

- Supabase auth session bridge
- role assignment resolution
- technician assignment lookup
- customer profile lookup
- server-only Supabase repository adapters
- Supabase audit sink
- service attachment signed upload adapter
- Simply Accounting signed download adapter
- notification destination signing/fallback behavior
- CI and production-readiness workflows
- environment/surface validation
- smoke scripts for storefront/admin/customer/technician

## Auth boundary

Production must prefer verified Supabase/Auth session context. Development header fallback is only allowed when:

```env
AUTH_DEV_HEADER_FALLBACK_ENABLED=true
```

Do not enable this in production.

## Service role boundary

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed in browser/client code.

## Storage buckets

```txt
service-attachments
simply-accounting-export-files
```

## Simply Accounting

Simply Accounting export remains finance-reviewed file/batch preparation only. Direct accounting sync is forbidden.
