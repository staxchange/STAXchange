# Service Repository Adapters

Service persistence is injected into command execution through `CommandContext.repositories.service`.

This keeps protected mutations inside `packages/commands` while allowing future database adapters.

## Current adapter

```txt
packages/service-interface/src/in-memory-service-repository.ts
```

This is a development placeholder.

## Notification adapter

```txt
packages/service-interface/src/webhook-service-notifier.ts
```

This posts service events to a configured webhook.

## Production rule

A Supabase-backed adapter may be added, but apps must not directly mutate service workflow tables.
