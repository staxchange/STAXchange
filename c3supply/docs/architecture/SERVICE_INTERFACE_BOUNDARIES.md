# Service Interface Boundaries

The service interface is a governed workflow layer for treatment systems.

## Allowed

- Service intake
- Severity/category classification
- Human service handoff
- Work order lifecycle
- Technician assignment placeholder
- Visit completion placeholder
- Audit event creation

## Forbidden in apps

- Direct Supabase writes
- Direct service work order mutation
- Direct technician assignment mutation
- Direct service completion mutation
- AI-generated final technical conclusions

Protected mutations belong in:

```txt
packages/commands/src/service
```
