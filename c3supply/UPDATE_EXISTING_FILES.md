# Required updates to existing repo files

## package.json

Add:

```json
"audit:service": "node scripts/audit-service-interface.mjs"
```

## tsconfig.base.json

Add:

```json
"@stax/service-interface": ["packages/service-interface/src/index.ts"]
```

## apps/storefront/package.json

Add dependency:

```json
"@stax/service-interface": "*"
```

## apps/storefront/next.config.ts

Add to `transpilePackages`:

```ts
"@stax/service-interface"
```

## apps/admin/package.json

Add dependency:

```json
"@stax/service-interface": "*"
```

## packages/commands/src/index.ts

Add:

```ts
export * from "./service/CreateServiceRequestCommand";
export * from "./service/TriageServiceRequestCommand";
export * from "./service/CreateServiceWorkOrderCommand";
export * from "./service/ScheduleServiceVisitCommand";
export * from "./service/AssignServiceTechnicianCommand";
export * from "./service/CompleteServiceVisitCommand";
export * from "./service/EscalateEmergencyServiceCommand";
```

## packages/governance/src/permissions.ts

Add permissions:

```ts
| "service.request.create"
| "service.request.triage"
| "service.work_order.create"
| "service.visit.schedule"
| "service.technician.assign"
| "service.visit.complete"
| "service.emergency.escalate"
```

Add role permission mapping:

- PUBLIC: `service.request.create`, `service.emergency.escalate`
- CUSTOMER: `service.request.create`, `service.emergency.escalate`
- SALES: `service.request.triage`, `service.work_order.create`
- OPS: all service permissions
- ADMIN: all service permissions
- SUPER_ADMIN: all service permissions

## packages/workflows/src/index.ts

Add:

```ts
export * from "./definitions/treatment-service";
import { treatmentServiceWorkflow } from "./definitions/treatment-service";
```

Add to `workflowDefinitions`:

```ts
treatmentServiceWorkflow
```

## jest.config.cjs

Add mapper:

```js
"^@stax/service-interface$": "<rootDir>/packages/service-interface/src/index.ts"
```
