# Service Production Wiring Runbook

1. Create Supabase project.
2. Run migrations `0003` through `0006`.
3. Create a private `service-attachments` storage bucket if migration did not create it.
4. Configure Vercel environment variables.
5. Configure Supabase Auth roles in `app_metadata.role`.
6. Create at least one OPS or ADMIN user.
7. Configure Teams/email/CRM webhook destination.
8. Test service request submission.
9. Test emergency escalation.
10. Test signed upload URL creation.
11. Confirm audit event persistence.
12. Confirm admin service APIs require auth.
