# Service Auth, RLS, and Rate Limits

## Admin authentication

Admin service APIs require a Supabase bearer token and validate the user role from `app_metadata.role` or `user_metadata.role`.

Allowed roles default to:

```txt
OPS, ADMIN, SUPER_ADMIN
```

## RLS

Service tables have RLS enabled. Staff users may read service records, while OPS/ADMIN/SUPER_ADMIN may manage service records.

Public service requests are written by server-side command adapters using the service role key, not by browser clients.

## Rate limiting

Public service APIs use an in-memory limiter as a first-pass protection:

```env
SERVICE_RATE_LIMIT_MAX=10
SERVICE_RATE_LIMIT_WINDOW_MS=60000
```

For high-volume production, replace this with Redis, Upstash, Supabase-backed counters, or edge middleware.
