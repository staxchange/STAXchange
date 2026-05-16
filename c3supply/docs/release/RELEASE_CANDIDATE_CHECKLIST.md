# Release Candidate Checklist

- No production secrets committed
- All audits pass
- All tests pass
- All app builds pass
- Supabase migrations reviewed
- Storage buckets reviewed
- Vercel envs reviewed
- Storefront deploys before admin/customer/technician
- C3 deploys separately from DWG
- Admin/customer/technician require auth validation
- No direct Simply Accounting sync
- No Stripe live mode until explicit approval
