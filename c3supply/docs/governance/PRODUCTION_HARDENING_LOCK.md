# Production Hardening Lock

## Active vertical

```txt
STAX / DALENSTAX Core OS
→ DWG ecommerce/service vertical
→ DWG boiler-room brand dress
```

## Strengthened checks

This revision adds audits for:

- vertical isolation
- secret exposure
- production surface readiness

## Do not introduce

```txt
Collectibles vertical
cards_master
vault_items
break room
sports-card marketplace
collectibles trust score
card data seeding
```

## Security lock

These must never be public:

```txt
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
SERVICE_NOTIFICATION_SHARED_SECRET
```

## Deployment lock

Deploy order remains:

```txt
1. storefront
2. admin after auth validation
3. technician after assignment validation
4. customer after customer identity validation
```
