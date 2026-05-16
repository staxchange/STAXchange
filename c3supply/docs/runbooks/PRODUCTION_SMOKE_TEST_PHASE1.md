# Production Smoke Test Phase 1

## DWG storefront

- `GET /`
- `GET /catalog`
- `GET /quote`
- `GET /cart`
- `GET /quote-view/test-token`
- `GET /order-status/test-token`
- `GET /api/health`
- `GET /api/readiness`

## C3 storefront

- `GET /`
- `GET /catalog`
- `GET /quote`
- `GET /cart`
- `GET /quote-view/test-token`
- `GET /order-status/test-token`

## Rules

Use fake smoke-test data only. Do not use live Stripe payments. Do not send real notifications. Do not use real customer data.
