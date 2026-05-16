# Supabase Migration Runbook

Run migrations in ascending order.

Key migration groups:

```txt
0003 treatment service interface
0004 service auth / technicians / attachments
0005 service RLS hardening
0006 notification audit log
0007 technician portal
0008 service billing / inventory / Simply Accounting prep
0009 customer portal / maintenance / notifications / reporting
0010 Simply Accounting export files
0011 Simply Accounting export storage / downloads
0012 finance review UI
0013 auth roles / route guards
```

## Storage buckets

Create:

```txt
service-attachments
simply-accounting-export-files
```

## Safety

Do not expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
