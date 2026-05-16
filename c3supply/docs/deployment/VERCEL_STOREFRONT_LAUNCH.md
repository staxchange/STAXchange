# Vercel Storefront Launch

Recommended public storefront deployment settings:

```txt
Project: dwg-storefront
Root Directory: apps/storefront
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

## Required environment variables

```env
NEXT_PUBLIC_SITE_NAME=DWG Process Supply
NEXT_PUBLIC_SITE_DOMAIN=dwgprocesssupply.com
OPENAI_API_KEY=
OPENAI_SUPPORT_MODEL=gpt-5-mini
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not expose server-only keys as `NEXT_PUBLIC_` variables.
