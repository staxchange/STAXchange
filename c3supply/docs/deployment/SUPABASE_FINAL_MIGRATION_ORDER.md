# Supabase Final Migration Order

Run migrations in ascending order.

```txt
0001_initial_schema.sql
0002_support_workflow.sql
0003_treatment_service_interface.sql
0004_service_auth_technicians_attachments.sql
0005_service_rls_policies_hardened.sql
0006_service_notification_audit_log.sql
0007_technician_portal.sql
0008_service_billing_inventory_sage.sql
0009_customer_portal_maintenance_notifications_reporting.sql
0010_simply_accounting_export_files.sql
0011_simply_accounting_export_storage_downloads.sql
0012_simply_accounting_finance_review_ui.sql
0013_auth_roles_route_guards.sql
```

## Storage buckets

Create:

```txt
service-attachments
simply-accounting-export-files
```

## Caution

RLS is enabled in migrations. Review policies in Supabase before production writes.

## Dry-run readiness references

The production-readiness dry run verifies these schema anchors are documented before project creation:

```txt
app_role_assignments
technician_work_order_access
audit_events
```

These support role assignment, technician assignment validation, and append-only audit event persistence.

```txt
0014_commerce_activation_phase1.sql
```

```txt
0015_photo_quote_intake.sql
```

```txt
0016_quote_documents_acceptance.sql
```

```txt
0017_pricing_margin_governance.sql
```


Storage bucket: `quote-documents` for customer-safe quote delivery snapshots.

```txt
0018_quote_delivery_notifications.sql
```

```txt
0019_stripe_payment_deposit_phase1.sql
```

```txt
0020_fulfillment_supplier_po_phase1.sql
```

```txt
0021_commerce_billing_accounting_handoff.sql
```
