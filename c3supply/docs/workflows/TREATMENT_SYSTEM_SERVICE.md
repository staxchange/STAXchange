# Treatment System Service Workflow

The service interface supports treatment system service intake and human operational workflow.

## Flow

```txt
Customer submits service request
→ sanitize request
→ classify severity/category
→ create service request through packages/commands
→ triage request
→ emergency escalation if required
→ work order creation
→ schedule visit
→ assign technician
→ complete visit
→ append audit events
```

## Emergency triggers

Emergency or priority human review is required for:

- flooding
- active leaks
- electrical concerns
- chemical feed concerns
- no-water outage
- installation/plumbing work
- safety risk
- uncertain system condition

## AI boundary

AI may help collect intake details, but must not make final service, safety, plumbing, electrical, chemical, sizing, or engineering conclusions.
