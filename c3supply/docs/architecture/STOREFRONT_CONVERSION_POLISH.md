# Storefront Conversion Polish

This layer improves the public storefront conversion path without changing protected workflows.

## Added

- trust strip
- quote-first funnel cards
- service emergency CTA
- sticky action bar
- catalog filtering UI
- mobile product cards
- contact routing panel
- metadata / OpenGraph helper

## Conversion paths

```txt
Quote path:
home/catalog/product → quote request → human review

Service path:
home/service/contact → service intake → triage → human review

Support path:
support → AI intake/handoff → human support
```

## Boundary

This is storefront presentation and routing only.

It does not:

- mutate Supabase directly
- auto-size systems
- auto-quote equipment
- auto-approve service or billing
- alter command governance
