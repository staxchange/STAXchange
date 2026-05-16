# Auth Guards Next Report

## Added

- `packages/authz`
- route policies for customer/admin/technician/storefront surfaces
- middleware for `apps/admin`, `apps/customer`, and `apps/technician`
- unauthorized pages
- `whoami` auth API routes
- role assignment / technician assignment migration
- auth guard docs/runbooks
- auth guard tests
- auth guard audit script

## Route policy highlights

- Customer portal: CUSTOMER / staff
- Technician portal: TECHNICIAN / service staff
- Finance export dashboard: FINANCE / ADMIN / SUPER_ADMIN
- Reporting: REPORTING / ADMIN / SUPER_ADMIN

## Boundary

Route guards do not authorize protected mutations directly.

Protected workflow mutation still requires `packages/commands`.
