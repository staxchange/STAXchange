# Production Smoke Tests

After deployment, check:

```txt
GET /
GET /catalog
GET /quote
GET /service
GET /support
GET /privacy
GET /terms
GET /api/health
GET /api/readiness
POST /api/service-system-lookup
```

For service/support POST routes, use safe test payloads only.
