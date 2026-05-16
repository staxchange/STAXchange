# Supabase Project Setup

## Project

```txt
dwg-commerce-service-production
```

## Migrations

Run migrations in numeric order from `0001` through `0021`. Review RLS before production writes.

## Buckets

Create private buckets:

```txt
service-attachments
simply-accounting-export-files
quote-documents
```

## Keys

`NEXT_PUBLIC_SUPABASE_ANON_KEY` may be public. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never use a `NEXT_PUBLIC_` prefix.

## Boundary

No public direct mutation to protected tables. Protected writes must route through command-gated server code.
