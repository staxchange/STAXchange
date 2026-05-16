# Service Interface Production Wiring Report

## Added

- `SupabaseServiceRepository`
- `SupabaseAuditSink`
- service-role-only server configuration
- Supabase REST adapter for inserts, updates, selects, and signed upload URLs
- real persistence adapter methods for service requests, triage, emergency escalation, work orders, scheduling, assignment, completion, attachments, and technician listing
- admin API routes protected by Supabase bearer token role validation
- technician user model migration
- service attachments migration and upload URL route
- hardened RLS policy migration
- Teams workflow notification adapter
- email/CRM generic webhook adapters
- composite notifier fanout
- service rate limiter
- production wiring docs and tests

## Boundary

Apps still do not import Supabase clients directly. API routes create command-context adapters, and commands perform protected mutations through repositories.

## Remaining production setup

- configure real Supabase environment variables
- configure `app_metadata.role` for staff/admin users
- configure Teams/email/CRM webhook destinations
- deploy migrations
- verify RLS policies against actual user roles
- replace in-memory rate limiter with shared production store for high volume
