# Domain and DNS Checklist

## Public domains

```txt
dwgprocesssupply.com
www.dwgprocesssupply.com
admin.dwgprocesssupply.com
tech.dwgprocesssupply.com
portal.dwgprocesssupply.com
```

## Launch order

1. Deploy storefront first.
2. Verify `/api/health`.
3. Verify `/api/readiness`.
4. Attach public domain.
5. Deploy admin/customer/technician after auth guards are configured.
6. Verify DNS and HTTPS.
