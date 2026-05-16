# AI Support Workflow Final Audit

## Scope

Added a governed AI tech support intake and human intervention workflow to the STAX ecommerce shell with the DWG Process Supply brand dress.

## New customer path

```txt
/support
→ /api/support-chat
→ packages/ai-support deterministic handoff rules
→ packages/commands support mutation gateway
→ apps/admin/app/support human queue
```

## New workflow

```txt
NEW
→ AI_TRIAGE
→ HUMAN_REVIEW_REQUIRED
→ ASSIGNED
→ CLOSED
```

## Handoff triggers

- customer asks for a human
- safety, leak, chemical, electrical, contamination, injury, or damage risk
- installation, sizing, plumbing, wiring, pressure, flow, drawing, or specification help
- warranty, order, return, damaged shipment, tracking, or replacement support
- quote, pricing, availability, or purchase request
- part identification or compatibility review
- repeated unresolved conversation
- AI unavailable

## Guardrails

The AI assistant is an intake and triage layer. It does not size systems, give installation instructions, make engineering conclusions, or bypass protected mutation governance.

## Commands run

```txt
npm install --ignore-scripts --prefer-offline                    PASS
npm run audit:support                                           PASS
npm run validate:boundaries                                     PASS
npm run lint                                                    PASS
npm run test                                                    PASS: 4 suites, 7 tests
npm run typecheck --workspace @stax/ai-support                  PASS
npm run typecheck --workspace @stax/commands                    PASS
npm run typecheck --workspace @stax/workflows                   PASS
npm run typecheck --workspace @stax/storefront                  PASS
npm run typecheck --workspace @stax/admin                       PASS
individual typechecks for remaining packages                    PASS
```

## Build audit note

The storefront Next.js production build compiled successfully, generated static pages, and printed the route manifest including `/support` and `/api/support-chat`. In this sandbox the command did not return cleanly after the route manifest and was terminated by the execution environment. Re-run `npm run build --workspace @stax/storefront` in GitHub Actions, Codespaces, or Vercel after import.

## Required production environment variables

```txt
OPENAI_API_KEY=
OPENAI_SUPPORT_MODEL=gpt-4o-mini
SUPPORT_HUMAN_EMAIL=support@dwgprocesssupply.com
SUPPORT_ESCALATION_WEBHOOK_URL=
```

## Production wiring still required

- Supabase repositories for support conversation/message/ticket persistence
- Microsoft 365 or Teams notification for new human handoff tickets
- protected admin authentication
- SLA rules and assignment logic
- verified support email/domain values
