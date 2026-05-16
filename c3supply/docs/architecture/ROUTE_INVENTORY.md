# Route Inventory

## DWG storefront
- catalog — public safe view
- cart — public/customer command route through cart commands
- quote — public/customer command route through quote commands
- quote-view — public safe token view / command acceptance
- order-status — public safe token view
- service/support — intake and handoff

## C3 storefront
- catalog/cart/quote/quote-view/order-status/legal/contact — C3 public safe views/commands, no DWG internal language

## Customer portal
- quotes/payments/orders/fulfillment/billing — customer-safe views and commands

## Admin
- commerce/photo quotes/pricing/quote documents/quote delivery/payments/fulfillment/supplier POs/billing/accounting handoff — protected admin/finance/ops command surfaces

## Technician/operator
- photo quote/work orders — technician/operator surfaces

Sensitive fields hidden from public/customer/C3 surfaces:
supplier costs, internal margin, supplier PO, accounting export internals, internal review notes.
