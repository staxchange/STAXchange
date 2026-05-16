# Vercel Project Order

## 1. Storefront first

```txt
Project: dwg-storefront
Root Directory: apps/storefront
Domain: dwgprocesssupply.com
```

Deploy this first and verify:

```txt
GET /
GET /catalog
GET /quote
GET /service
GET /support
GET /api/health
GET /api/readiness
```

## 2. Admin second

```txt
Project: dwg-admin
Root Directory: apps/admin
Domain: admin.dwgprocesssupply.com
```

Do not expose admin until auth guard validation passes.

## 3. Technician third

```txt
Project: dwg-technician
Root Directory: apps/technician
Domain: tech.dwgprocesssupply.com
```

Do not expose technician portal until assignment checks are validated.

## 4. Customer fourth

```txt
Project: dwg-customer
Root Directory: apps/customer
Domain: portal.dwgprocesssupply.com
```

Do not expose customer portal until customer identity/session checks are validated.


## C3 Supply public storefront

```txt
Project: c3-storefront
Root Directory: apps/c3-storefront
Domain: c3supply.co
Redirect/trust domain: c3supply.ca
```
