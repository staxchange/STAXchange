# Auth Guards Local Dev

For local placeholder testing, route guards read these headers:

```txt
x-stax-actor-id
x-stax-role
x-stax-email
x-stax-assigned-work-orders
```

Production must replace placeholder headers with verified Supabase/Auth provider sessions.

Never trust customer-provided headers in production unless they are injected by trusted middleware/server infrastructure.
