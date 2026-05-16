# Support Human Intervention Runbook

## When to intervene

Human support should take over when the support assistant flags:

- safety, leak, chemical, electrical, contamination, or damage risk
- installation or sizing help
- warranty, return, order, damaged shipment, or replacement issue
- quote, pricing, availability, or purchase request
- part identification or compatibility review
- repeated unresolved conversation
- customer directly asks for a human

## Staff workflow

1. Open the support queue in `apps/admin/app/support`.
2. Review the conversation summary, customer contact, product/model, photos, order or quote number, and site conditions.
3. Assign the ticket to Sales, Ops, or Technical Support.
4. Contact the customer.
5. Close the ticket only after resolution or clear next step.

## Production integrations to add later

- Supabase command repositories
- Microsoft 365 email notification
- Teams notification
- ticket assignment rules
- SLA timers
- support inbox sync
