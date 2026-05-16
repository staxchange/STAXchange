# Vercel Environment Setup

## Public variables

```env
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_SITE_DOMAIN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Server-only variables

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SERVICE_NOTIFICATION_SHARED_SECRET=
```

## Forbidden public variables

```txt
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_OPENAI_API_KEY
NEXT_PUBLIC_STRIPE_SECRET_KEY
```

Do not place server-only values in client components, public env variables, or screenshots.
