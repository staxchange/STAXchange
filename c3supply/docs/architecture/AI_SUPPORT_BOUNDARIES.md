# AI Support Boundaries

The support assistant is a triage and intake layer.

It may:

- answer basic process and intake questions
- collect product/model/order/quote/contact details
- summarize the issue for support staff
- trigger a human handoff workflow

It must not:

- size systems
- provide installation instructions for plumbing, electrical, chemical, pressure, or safety-sensitive work
- make engineering conclusions
- claim production ticket creation unless a command returns ticket data
- bypass `packages/commands` for protected support persistence

Human intervention is required for safety, installation, sizing, warranty, order, quote, compatibility, and unresolved technical issues.
