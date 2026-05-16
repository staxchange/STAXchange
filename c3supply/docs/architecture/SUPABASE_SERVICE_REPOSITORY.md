# Supabase Service Repository

The production service interface uses `SupabaseServiceRepository` as the server-only persistence adapter.

## Boundary

Apps do not import Supabase clients directly.

Route handlers create command contexts with:

```txt
repositories.service = SupabaseServiceRepository
notifications.service = CompositeServiceNotifier
audit = SupabaseAuditSink
```

Commands remain the protected mutation gateway.

## Service-role rule

The service role key must only exist in server runtime environments. It must never be exposed as a `NEXT_PUBLIC_` variable or sent to browser code.

## Persistence

The repository writes to:

- `service_requests`
- `service_work_orders`
- `service_visits`
- `technician_assignments`
- `service_attachments`

Audit events are appended to `audit_events` through `SupabaseAuditSink`.
