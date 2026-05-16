# Tech Support Human Handoff

The DWG support assistant is an intake and routing tool. It is not a technician, engineer, installer, diagnostic authority, pricing authority, or warranty authority.

## Flow

```txt
Customer opens /support
→ API sanitizes request
→ command creates/continues support conversation
→ command records user message
→ deterministic escalation rules run before any AI response
→ if escalation required, command creates human support ticket
→ if safe, AI provides basic intake guidance
→ assistant message is recorded through command layer
```

## Always escalate

Human support review is required for:

- leaks, flooding, water damage, unsafe conditions, contamination, injury, or emergency language
- chemical, chlorine, acid, electrical, pressure, plumbing, or installation questions
- sizing, flow rate, GPM, hardness, iron, manganese, capacity, or treatment design questions
- compatibility confirmation, part identification, model identification, and replacement confirmation
- quotes, pricing, availability, order status, warranty, returns, refunds, and damaged shipments
- explicit requests for a human support person
- repeated unresolved conversations
- AI outage or unavailable model response

## Allowed AI behavior

The assistant may:

- collect support details
- explain which information the customer should prepare
- answer basic navigation and category questions
- tell the customer that human review is required
- summarize the issue for handoff

## Forbidden AI behavior

The assistant must not:

- size a system
- diagnose a treatment issue as final authority
- confirm product compatibility
- give installation, plumbing, electrical, chemical, or pressure instructions
- promise pricing, refunds, delivery, warranty, or availability
- claim a ticket exists unless a command returned ticket data
- bypass `packages/commands`

## Governance boundary

Apps may call API routes and commands. Apps must not directly mutate protected support, quote, order, fulfillment, pricing, or catalog workflows.

`packages/commands` remains the protected mutation gateway.
