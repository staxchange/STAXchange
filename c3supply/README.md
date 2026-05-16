# STAX Treatment Systems Service Interface

This module adds a governed service interface for water treatment systems.

It is designed for the existing STAX Ecommerce Shell + DWG Process Supply brand dress.

## What it adds

- Public service request page
- Service request API
- Installed system lookup API placeholder
- Admin service queue
- Service-interface DTOs and rules package
- Command-layer service mutations
- Treatment system service workflow
- Supabase placeholder schema
- Service boundary docs
- Service audit script
- Service intake tests

## Service flow

```txt
Customer submits service request
→ request is sanitized/classified
→ CreateServiceRequestCommand runs
→ TriageServiceRequestCommand classifies severity/category
→ if emergency risk, EscalateEmergencyServiceCommand runs
→ admin service queue receives placeholder workflow record
→ OPS creates work order
→ technician assigned
→ service visit scheduled
→ technician completes visit
→ audit trail appended
```

## Production boundary

Apps can submit service requests to API routes.

Apps cannot directly mutate:

- treatment_systems
- service_requests
- service_work_orders
- service_visits
- technician_assignments
- service_audit_events

Protected mutations go through `packages/commands`.


## Final Master Bundle

This repository now includes the consolidated DWG/STAX ecommerce, service, technician, customer, billing, Simply Accounting export prep, auth, launch, and deployment hardening layers.

Run:

```bash
npm run audit:master
npm run audit:all
npm run test -- --runInBand
```

Before production deployment, complete the Supabase/Vercel/environment steps in:

```txt
docs/runbooks/LAUNCH_DAY_RUNBOOK.md
docs/deployment/PRODUCTION_ENVIRONMENT_MATRIX.md
docs/deployment/SUPABASE_FINAL_MIGRATION_ORDER.md
```


## Active Vertical Lock

This repository is the **DWG ecommerce/service vertical** on top of the STAX/DALENSTAX core operating system.

It is not the Collectibles/STAX app.

```txt
STAX Core OS
→ Commerce + Service Shell
→ DWG Process Supply operational workflows
→ DWG boiler-room brand dress
```
