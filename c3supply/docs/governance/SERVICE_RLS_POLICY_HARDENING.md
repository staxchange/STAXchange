# Service RLS Policy Hardening

Migration `0004_service_rls_auth_uploads_notifications.sql` adds:

- service_profiles
- service_technicians
- service_uploads
- service_notifications
- private.has_service_role()
- private.current_service_role()
- RLS policies for service staff access
- private storage bucket policies for service uploads

## Important

Public service request submission should go through the server API and command layer, not direct browser Supabase writes.

Authenticated service staff can read/update service data according to role policies. Protected workflow mutations still route through `packages/commands`.
