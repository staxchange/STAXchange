# AI Support Hardening Report

## Status

The AI support chatbot was hardened as a governed intake and human handoff workflow.

## Completed hardening

- Added strict support request sanitizer.
- Enforced maximum 12 chat messages per request.
- Enforced maximum 2,000 characters per message.
- Enforced maximum 10,000 total characters per request.
- Rejected malformed message objects.
- Rejected invalid roles. Only `user` and `assistant` are accepted by the public API.
- Rejected invalid conversation IDs.
- Sanitized customer name, email, phone, and company fields.
- Locked brand context to `DWG Process Supply`; customer payloads cannot override `brandId` or `siteName`.
- Ensured deterministic escalation runs before any OpenAI call.
- Ensured escalated requests do not receive technical AI answers.
- Ensured AI unavailable state creates a human support handoff path.
- Added part identification and compatibility to required human handoff.
- Added support hardening docs.
- Added support sanitizer tests.
- Expanded support escalation tests.
- Enhanced support workflow audit script.

## Commands run

```bash
npm install --ignore-scripts --silent
npm run audit:support
npm run validate:boundaries
npm run test -- --runInBand
npm run typecheck --workspace @stax/ai-support
npm run typecheck --workspace @stax/commands
npm run typecheck --workspace @stax/workflows
npm run typecheck --workspace @stax/storefront
npm run typecheck --workspace @stax/admin
npm run build --workspace @stax/storefront
```

## Passing results

```txt
AI support workflow hardening audit passed.
Boundary validation passed.
5 test suites passed.
14 tests passed.
@stax/ai-support typecheck passed.
@stax/commands typecheck passed.
@stax/workflows typecheck passed.
@stax/storefront typecheck passed.
@stax/admin typecheck passed.
```

## Build note

`npm run build --workspace @stax/storefront` compiled successfully in the sandbox and reached static page generation, then the execution environment timed out before process completion. Re-run the build in GitHub Actions, Codespaces, local dev, or Vercel.

## Production blockers remaining

- Real Supabase persistence inside `packages/commands` support command `executeMutation()` methods.
- Real human notification destination: email, Teams, webhook, CRM, or helpdesk.
- Authenticated admin queue.
- Rate limiting and bot-abuse protection.
- File/photo upload workflow if support needs images.
- Production OpenAI key in Vercel environment variables.

## Governance status

The hardening keeps the boundary intact:

```txt
apps/storefront → API route → packages/commands → placeholder mutation/audit
```

The app still does not directly mutate Supabase, Stripe, support tickets, quote data, order data, pricing, catalog publication, or fulfillment workflows.
