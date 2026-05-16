# Role Permission Matrix

| Role | Allowed Areas | Forbidden |
|---|---|---|
| PUBLIC | cart/quote, public quote/payment/order status token views | supplier costs, pricing approval, supplier PO approval, accounting export |
| CUSTOMER | customer-safe quotes, payments, orders, fulfillment, billing | supplier costs, pricing approval, supplier PO approval, accounting export |
| TECHNICIAN | photo quote, assigned work orders | quote/pricing/accounting approval |
| SALES | cart/quote, pricing review draft, quote delivery support | finance approval, accounting export |
| OPS | operational quote/fulfillment support | unaudited overrides |
| SERVICE_MANAGER | service/photo quote review | accounting export approval |
| FULFILLMENT_MANAGER | fulfillment and supplier PO review | accounting posting |
| FINANCE | invoice review, payment review, accounting handoff | auto-posting |
| ADMIN | all governed areas with audit | unaudited override |
| SUPER_ADMIN | all governed areas with audit | unaudited override |

PUBLIC/CUSTOMER cannot see supplier costs, approve pricing, approve supplier POs, or trigger accounting export.
TECHNICIAN cannot approve quote/pricing/accounting.
FINANCE controls invoice/accounting handoff.
ADMIN/SUPER_ADMIN override requires audit.
