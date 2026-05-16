# Final Audit Report — STAX Ecommerce Shell + DWG Dress

Generated: 2026-05-13T12:12:39.829510+00:00

## Result

PASS

## Build-and-test commands executed

| Command | Result |
|---|---|
| `npm install --ignore-scripts` | PASS |
| `npm run validate:boundaries` | PASS |
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 3 suites / 4 tests |
| `npm run build --workspace @stax/storefront` | PASS |
| `npm run build --workspace @stax/admin` | PASS |

## Fixes applied during file-by-file build

- Removed package/brand `rootDir` constraints from package-level TypeScript configs so workspace path aliases typecheck cleanly.
- Expanded `CreateQuoteRequestCommandInput` to support optional `company` and `phone` fields used by the storefront quote form.
- Updated `apps/storefront/app/product/[slug]/page.tsx` for Next.js 15 async `params` typing.
- Added the TypeScript parser to `eslint.config.js` so Next.js can lint `.ts` and `.tsx` files during production builds.
- Set the root build script to `turbo run build --concurrency=1` to avoid concurrent Next.js build pressure in constrained environments.
- Generated `package-lock.json` so Vercel/GitHub Actions use npm instead of guessing Yarn.

## Governance audit

- Every command file exposes `validateInput`, `validateActor`, `governanceGuard`, `executeMutation`, `appendAuditEvent`, and `returnSafeDTO`.
- Apps do not directly import Supabase or Stripe mutation clients.
- `packages/commands` remains the only protected mutation gateway.
- DWG brand dress is isolated in `brands/dwg`.
- Workflow definitions are centralized in `packages/workflows`.
- Static GitHub Pages fallback exists under `docs/`.

## File-by-file manifest

- `.env.example` — ok — 12 lines — non-empty
- `.github/workflows/ci.yml` — ok — 29 lines — non-empty
- `.github/workflows/pages.yml` — ok — 29 lines — non-empty
- `.gitignore` — ok — 10 lines — non-empty
- `.npmrc` — ok — 3 lines — non-empty
- `COPILOT_IMPORT_PROMPT.txt` — ok — 20 lines — non-empty
- `README.md` — ok — 93 lines — non-empty
- `TREE.txt` — ok — 225 lines — non-empty
- `apps/admin/app/exports/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/admin/app/fulfillment/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/admin/app/layout.tsx` — ok — 17 lines — non-empty, app-boundary
- `apps/admin/app/page.tsx` — ok — 19 lines — non-empty, app-boundary
- `apps/admin/app/pricing/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/admin/app/products/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/admin/app/quotes/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/admin/next-env.d.ts` — ok — 7 lines — non-empty, app-boundary
- `apps/admin/next.config.ts` — ok — 15 lines — non-empty, app-boundary
- `apps/admin/package.json` — ok — 28 lines — non-empty, valid-json
- `apps/admin/tsconfig.json` — ok — 12 lines — non-empty, valid-json
- `apps/storefront/app/api/quote/route.ts` — ok — 28 lines — non-empty, app-boundary
- `apps/storefront/app/cart/page.tsx` — ok — 10 lines — non-empty, app-boundary
- `apps/storefront/app/catalog/page.tsx` — ok — 33 lines — non-empty, app-boundary
- `apps/storefront/app/contact/page.tsx` — ok — 16 lines — non-empty, app-boundary
- `apps/storefront/app/globals.css` — ok — 162 lines — non-empty
- `apps/storefront/app/layout.tsx` — ok — 41 lines — non-empty, app-boundary
- `apps/storefront/app/page.tsx` — ok — 38 lines — non-empty, app-boundary
- `apps/storefront/app/product/[slug]/page.tsx` — ok — 31 lines — non-empty, app-boundary
- `apps/storefront/app/quote/page.tsx` — ok — 23 lines — non-empty, app-boundary
- `apps/storefront/app/quote/thank-you/page.tsx` — ok — 9 lines — non-empty, app-boundary
- `apps/storefront/next-env.d.ts` — ok — 7 lines — non-empty, app-boundary
- `apps/storefront/next.config.ts` — ok — 15 lines — non-empty, app-boundary
- `apps/storefront/package.json` — ok — 29 lines — non-empty, valid-json
- `apps/storefront/tsconfig.json` — ok — 12 lines — non-empty, valid-json
- `brands/dwg/DWG_DRESS.md` — ok — 15 lines — non-empty
- `brands/dwg/package.json` — ok — 17 lines — non-empty, valid-json
- `brands/dwg/src/brand.ts` — ok — 27 lines — non-empty
- `brands/dwg/src/categories.ts` — ok — 30 lines — non-empty
- `brands/dwg/src/index.ts` — ok — 4 lines — non-empty
- `brands/dwg/src/products.ts` — ok — 50 lines — non-empty
- `brands/dwg/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `docs/CNAME` — ok — 2 lines — non-empty
- `docs/architecture/ARCHITECTURE.md` — ok — 11 lines — non-empty
- `docs/architecture/DWG_DRESS_MODEL.md` — ok — 6 lines — non-empty
- `docs/deployment/GITHUB_PAGES.md` — ok — 6 lines — non-empty
- `docs/deployment/VERCEL.md` — ok — 4 lines — non-empty
- `docs/governance/MUTATION_GATEWAY.md` — ok — 6 lines — non-empty
- `docs/index.html` — ok — 36 lines — non-empty
- `docs/runbooks/INCIDENTS.md` — ok — 4 lines — non-empty
- `docs/runbooks/LOCAL_DEV.md` — ok — 4 lines — non-empty
- `docs/runbooks/RELEASE.md` — ok — 4 lines — non-empty
- `docs/styles.css` — ok — 86 lines — non-empty
- `docs/workflows/PRODUCT_PUBLICATION.md` — ok — 6 lines — non-empty
- `docs/workflows/QUOTE_FIRST.md` — ok — 4 lines — non-empty
- `eslint.config.js` — ok — 46 lines — non-empty
- `infra/github/README.md` — ok — 5 lines — non-empty
- `infra/supabase/README.md` — ok — 6 lines — non-empty
- `infra/supabase/migrations/0001_initial_schema.sql` — ok — 84 lines — non-empty
- `infra/vercel/README.md` — ok — 15 lines — non-empty
- `jest.config.cjs` — ok — 15 lines — non-empty
- `package-lock.json` — ok — 6313 lines — non-empty, valid-json
- `package.json` — ok — 35 lines — non-empty, valid-json
- `packages/audit/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/audit/src/append-audit-event.ts` — ok — 16 lines — non-empty
- `packages/audit/src/audit-event.ts` — ok — 12 lines — non-empty
- `packages/audit/src/index.ts` — ok — 3 lines — non-empty
- `packages/audit/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/catalog/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/catalog/src/index.ts` — ok — 8 lines — non-empty
- `packages/catalog/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/commands/package.json` — ok — 19 lines — non-empty, valid-json
- `packages/commands/src/catalog/ApproveProductLaunchCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/catalog/PublishProductCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/catalog/QuarantineProductCommand.ts` — ok — 83 lines — non-empty, command-lifecycle
- `packages/commands/src/command-contract.ts` — ok — 21 lines — non-empty
- `packages/commands/src/command-result.ts` — ok — 13 lines — non-empty
- `packages/commands/src/commerce/AddToCartCommand.ts` — ok — 84 lines — non-empty, command-lifecycle
- `packages/commands/src/commerce/CreateCheckoutSessionCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/commerce/CreateOrderFromStripeCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/fulfillment/CreateFulfillmentRequestCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/fulfillment/GeneratePackingSlipCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/index.ts` — ok — 19 lines — non-empty
- `packages/commands/src/internal/run-command.ts` — ok — 27 lines — non-empty
- `packages/commands/src/ops/CreateCapitalSignalCommand.ts` — ok — 83 lines — non-empty, command-lifecycle
- `packages/commands/src/ops/ExportSageBatchCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/pricing/ApproveRetailPriceCommand.ts` — ok — 83 lines — non-empty, command-lifecycle
- `packages/commands/src/pricing/ValidateProductPricingCommand.ts` — ok — 84 lines — non-empty, command-lifecycle
- `packages/commands/src/quotes/AcceptQuoteCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/quotes/CreateQuoteRequestCommand.ts` — ok — 88 lines — non-empty, command-lifecycle
- `packages/commands/src/quotes/DraftQuoteCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/src/quotes/SendQuoteCommand.ts` — ok — 82 lines — non-empty, command-lifecycle
- `packages/commands/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/commerce-shell/package.json` — ok — 18 lines — non-empty, valid-json
- `packages/commerce-shell/src/index.ts` — ok — 3 lines — non-empty
- `packages/commerce-shell/src/routes.ts` — ok — 7 lines — non-empty
- `packages/commerce-shell/src/shell-policy.ts` — ok — 7 lines — non-empty
- `packages/commerce-shell/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/commerce/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/commerce/src/index.ts` — ok — 11 lines — non-empty
- `packages/commerce/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/core-contracts/package.json` — ok — 15 lines — non-empty, valid-json
- `packages/core-contracts/src/index.ts` — ok — 80 lines — non-empty
- `packages/core-contracts/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/fulfillment/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/fulfillment/src/index.ts` — ok — 8 lines — non-empty
- `packages/fulfillment/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/governance/package.json` — ok — 15 lines — non-empty, valid-json
- `packages/governance/src/actors.ts` — ok — 8 lines — non-empty
- `packages/governance/src/guards.ts` — ok — 22 lines — non-empty
- `packages/governance/src/index.ts` — ok — 5 lines — non-empty
- `packages/governance/src/permissions.ts` — ok — 63 lines — non-empty
- `packages/governance/src/results.ts` — ok — 12 lines — non-empty
- `packages/governance/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/pricing/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/pricing/src/index.ts` — ok — 8 lines — non-empty
- `packages/pricing/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/quotes/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/quotes/src/index.ts` — ok — 8 lines — non-empty
- `packages/quotes/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/signals/package.json` — ok — 15 lines — non-empty, valid-json
- `packages/signals/src/index.ts` — ok — 13 lines — non-empty
- `packages/signals/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/tooling/package.json` — ok — 15 lines — non-empty, valid-json
- `packages/tooling/src/index.ts` — ok — 2 lines — non-empty
- `packages/tooling/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/ui/package.json` — ok — 15 lines — non-empty, valid-json
- `packages/ui/src/index.ts` — ok — 10 lines — non-empty
- `packages/ui/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `packages/workflows/package.json` — ok — 17 lines — non-empty, valid-json
- `packages/workflows/src/definitions/checkout.ts` — ok — 15 lines — non-empty
- `packages/workflows/src/definitions/fulfillment.ts` — ok — 15 lines — non-empty
- `packages/workflows/src/definitions/pricing-approval.ts` — ok — 15 lines — non-empty
- `packages/workflows/src/definitions/product-publication.ts` — ok — 19 lines — non-empty
- `packages/workflows/src/definitions/quote-first.ts` — ok — 16 lines — non-empty
- `packages/workflows/src/definitions/sage-export.ts` — ok — 14 lines — non-empty
- `packages/workflows/src/index.ts` — ok — 31 lines — non-empty
- `packages/workflows/src/workflow-engine.ts` — ok — 23 lines — non-empty
- `packages/workflows/src/workflow-types.ts` — ok — 24 lines — non-empty
- `packages/workflows/tsconfig.json` — ok — 8 lines — non-empty, valid-json
- `scripts/print-workflows.mjs` — ok — 8 lines — non-empty
- `scripts/validate-boundaries.mjs` — ok — 39 lines — non-empty
- `tests/governance/command-lifecycle.test.ts` — ok — 33 lines — non-empty
- `tests/governance/import-boundary.test.ts` — ok — 27 lines — non-empty
- `tests/governance/mutation-gateway.test.ts` — ok — 12 lines — non-empty
- `tsconfig.base.json` — ok — 36 lines — non-empty
- `turbo.json` — ok — 23 lines — non-empty, valid-json
- `vercel.json` — ok — 7 lines — non-empty, valid-json

## Issues

- None found.
