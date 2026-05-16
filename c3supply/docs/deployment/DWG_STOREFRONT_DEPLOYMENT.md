# DWG Storefront Deployment

## Project

```txt
dwg-storefront
```

## Root directory

```txt
apps/storefront
```

## Deployment order

Deploy DWG storefront preview first, then production after smoke tests pass.

## Smoke targets

- `/`
- `/catalog`
- `/quote`
- `/cart`
- `/quote-view/test-token`
- `/order-status/test-token`
- `/api/health`
- `/api/readiness`

Do not deploy admin/customer/technician publicly until auth validation passes.
