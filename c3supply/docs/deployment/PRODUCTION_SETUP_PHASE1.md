# Production Setup Phase 1

## Scope

Prepare the DWG/STAX ecommerce/service release candidate for infrastructure setup without adding business features or deploying internal apps.

## Required order

1. Validate repository in GitHub/Codespaces.
2. Create Supabase project `dwg-commerce-service-production`.
3. Run migrations in order from `0001` through `0021`.
4. Create storage buckets.
5. Add Vercel environment variables.
6. Deploy DWG storefront preview first.
7. Smoke test DWG storefront.
8. Deploy C3 storefront preview separately.
9. Smoke test C3 storefront.
10. Deploy admin/customer/technician only after auth validation.

## Boundary

No direct accounting sync. No auto-posting. No auto-fulfillment. No auto-send supplier PO. No Stripe live mode until explicitly approved.
