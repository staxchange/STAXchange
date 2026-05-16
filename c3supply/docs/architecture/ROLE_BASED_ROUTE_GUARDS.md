# Role-based Route Guards

This layer adds route-level access policy for:

- customer portal
- admin app
- technician portal
- finance export dashboard

The guards evaluate route policies against authenticated actor roles.

## Roles

- CUSTOMER
- TECHNICIAN
- SERVICE_MANAGER
- OPS
- FINANCE
- REPORTING
- ADMIN
- SUPER_ADMIN

## Boundary

Route guards do not grant mutation authority by themselves.

Protected workflow mutations still route through `packages/commands`.
