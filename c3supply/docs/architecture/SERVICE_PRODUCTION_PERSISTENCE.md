# Service Production Persistence

The treatment systems service interface now has a production persistence adapter.

## Server-only adapter

`createSupabaseServiceRoleClient()` creates a Supabase client only on the server and requires:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

The service-role key must never be exposed as a `NEXT_PUBLIC_` variable.

## Repository adapter

`SupabaseServiceRepository` writes and reads service workflow records:

- service_requests
- service_work_orders
- service_visits
- technician_assignments
- treatment_systems

Apps still call API routes. API routes call commands. Commands call the repository adapter.

## Human notification

`MultiDestinationServiceNotifier` can post to:

- service webhook
- Microsoft Teams webhook
- email automation webhook
- CRM webhook

## Uploads

`createServiceUploadSignedUrl()` creates signed upload URLs for the private `service-uploads` bucket and records upload intent in `service_uploads`.

## Rate limiting

The included rate limiter is in-memory and suitable for scaffold/local/low-volume use only. Replace with Redis, Upstash, Vercel KV, or Supabase-backed limits before high-volume production.
