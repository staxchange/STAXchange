# Rollback Checklist

1. Identify failing deployment.
2. Preserve logs and audit events.
3. Revert Vercel deployment to previous stable build.
4. Disable affected workflow flags if needed.
5. Do not delete audit records.
6. Record rollback note.
7. Re-run smoke tests.
