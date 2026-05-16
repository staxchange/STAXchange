# Customer Portal / Maintenance / Notifications / Reporting Next-5 Report

## Added

- `apps/customer`
- `packages/customer-portal`
- `packages/maintenance-plans`
- `packages/notifications`
- `packages/reporting`
- customer, maintenance, notification, and reporting commands
- workflow definitions
- admin reporting, notifications, and maintenance-plan pages
- Supabase migration `0009_customer_portal_maintenance_notifications_reporting.sql`
- audit script `scripts/audit-customer-ops.mjs`
- tests for customer access, maintenance plans, notifications, reporting, and boundary safety

## Workflow layers

```txt
Customer Portal:
REQUESTED → SESSION_CREATED → SYSTEM_LINKED → ACTIVE

Maintenance Plan:
DRAFT → PLAN_CREATED → ACTIVE → VISIT_SCHEDULED → RENEWED / CANCELLED

Notification Delivery:
PREFERENCE_CREATED → QUEUED → SENT / FAILED

Ops Reporting:
REQUESTED → SERVICE_KPI_CREATED → OPS_REPORT_CREATED
```

## Boundary

Customer portal views are read-focused. Protected records remain controlled by command-layer workflows.
