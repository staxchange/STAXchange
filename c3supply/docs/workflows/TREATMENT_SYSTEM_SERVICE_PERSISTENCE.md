# Treatment System Service Persistence Continuation

The service interface now supports repository and notification adapters passed through command context.

## Current state

```txt
apps/storefront/app/api/service-request
→ creates service command context adapters
→ runs commands
→ commands call repository adapter if supplied
→ commands call notifier adapter if supplied
→ commands append audit event placeholders
```

## Production target

Replace the in-memory repository with a Supabase-backed repository inside the service package or an infra adapter.

Apps must not directly call Supabase writes.

## Human notification

Emergency service events can notify a human destination through:

```txt
SERVICE_ESCALATION_WEBHOOK_URL
```

Recommended destinations:

- Microsoft Teams webhook
- shared service inbox automation
- CRM/helpdesk webhook
- dispatch platform webhook

## Boundary

The service interface may classify and route intake. It may not make final technical, chemical, electrical, plumbing, sizing, compatibility, safety, or warranty conclusions.
