import type { ActorRole } from "./actors";

export type Permission =
  | "catalog.approve"
  | "catalog.publish"
  | "catalog.quarantine"
  | "pricing.approve"
  | "pricing.validate"
  | "commerce.cart"
  | "commerce.checkout"
  | "commerce.order"
  | "quotes.create"
  | "quotes.draft"
  | "quotes.send"
  | "quotes.accept"
  | "fulfillment.create"
  | "fulfillment.packing_slip"
  | "ops.sage_export"
  | "ops.capital_signal"
  | "support.conversation.create"
  | "support.message.send"
  | "support.ticket.create"
  | "support.ticket.assign"
  | "support.ticket.close"
  | "service.request.create"
  | "service.request.triage"
  | "service.work_order.create"
  | "service.visit.schedule"
  | "service.technician.assign"
  | "service.visit.complete"
  | "service.emergency.escalate"
  | "technician.session.create"
  | "technician.work_orders.list"
  | "technician.work_order.start"
  | "technician.checklist.complete"
  | "technician.note.add"
  | "technician.parts.add"
  | "technician.photo.attach"
  | "technician.closeout.submit"
  | "manager.closeout.review"
  | "manager.closeout.approve"
  | "manager.closeout.reject"
  | "billing.labor.create"
  | "billing.parts.add"
  | "billing.invoice.create"
  | "billing.invoice.line_item.add"
  | "billing.invoice.submit_review"
  | "billing.invoice.approve"
  | "billing.invoice.reject"
  | "billing.packet.create"
  | "billing.sage_batch.create"
  | "billing.sage_batch.mark_ready"
  | "inventory.adjustment.record"
  | "maintenance.followup.create"
  | "customer.portal.session.create"
  | "customer.system.link"
  | "customer.notification_preferences.update"
  | "maintenance.plan.create"
  | "maintenance.plan.activate"
  | "maintenance.plan.visit.schedule"
  | "maintenance.plan.renew"
  | "maintenance.plan.cancel"
  | "notification.preference.create"
  | "notification.queue.create"
  | "notification.mark_sent"
  | "reporting.kpi_snapshot.create"
  | "reporting.ops_report.create"
  | "cart.create"
  | "cart.item.add"
  | "cart.item.update"
  | "cart.item.remove"
  | "cart.convert_quote"
  | "commerce.quote.create"
  | "commerce.quote.attach_product"
  | "commerce.quote.draft"
  | "commerce.quote.submit_review"
  | "commerce.quote.approve"
  | "commerce.quote.send"
  | "commerce.quote.accept"
  | "commerce.order.create"
  | "photo_quote.intake.create"
  | "photo_quote.photo.attach"
  | "photo_quote.extraction.record"
  | "photo_quote.review.request"
  | "photo_quote.more_info.request"
  | "photo_quote.convert_quote"
  | "photo_quote.close"
  | "quote_document.create"
  | "quote_document.approve"
  | "quote_document.generate_pdf"
  | "quote_document.share_link.create"
  | "quote_document.view.record"
  | "quote_document.accept"
  | "quote_document.revision.request"
  | "quote_document.expire"
  | "quote_document.order.create"
  | "pricing.supplier_cost.create"
  | "pricing.supplier_cost.update"
  | "pricing.supplier_cost.mark_stale"
  | "pricing.review.create"
  | "pricing.margin_rule.apply"
  | "pricing.quote.approve"
  | "pricing.quote.reject"
  | "pricing.quote.lock"
  | "quote_delivery.create"
  | "quote_delivery.document.store"
  | "quote_delivery.share_token.create"
  | "quote_delivery.notification.send"
  | "quote_delivery.view.record"
  | "quote_delivery.accept.record"
  | "quote_delivery.revision.record"
  | "quote_delivery.fail"
  | "quote_delivery.expire"
  | "quote_delivery.close"
  | "payment.request.create"
  | "payment.request.submit_review"
  | "payment.request.approve"
  | "payment.request.reject"
  | "payment.checkout.create"
  | "payment.pending.record"
  | "payment.succeeded.record"
  | "payment.failed.record"
  | "payment.canceled.record"
  | "payment.refund_review.request"
  | "payment.close"
  | "fulfillment.plan.create"
  | "fulfillment.decision.record"
  | "fulfillment.request.create"
  | "fulfillment.shipment_pending.mark"
  | "fulfillment.shipment_confirmation.record"
  | "fulfillment.customer.notify"
  | "fulfillment.close"
  | "fulfillment.block"
  | "supplier_po.draft"
  | "supplier_po.submit_review"
  | "supplier_po.approve"
  | "supplier_po.reject"
  | "supplier_po.revision.request"
  | "supplier_po.sent_manual.mark"
  | "dropship.request.prepare"
  | "commerce_invoice.draft.create"
  | "commerce_invoice.line.add"
  | "commerce_invoice.submit_finance_review"
  | "commerce_invoice.approve"
  | "commerce_invoice.reject"
  | "commerce_billing_packet.create"
  | "commerce_invoice.close"
  | "commerce_payment.reconciliation.record"
  | "commerce_tax_freight.placeholder.record"
  | "accounting_handoff.create"
  | "accounting_export.review.submit"
  | "accounting_export.ready.mark"
  | "accounting_export.manual.mark"
  | "accounting_reconciliation.note.add"
  | "accounting_export.failed.mark";

const publicPermissions: Permission[] = [
  "quotes.create",
  "support.conversation.create",
  "support.message.send",
  "support.ticket.create",
  "service.request.create",
  "service.emergency.escalate",
  "cart.create",
  "cart.item.add",
  "cart.item.update",
  "cart.item.remove",
  "cart.convert_quote",
  "commerce.quote.create",
  "commerce.quote.accept",
  "quote_document.view.record",
  "quote_document.accept",
  "quote_document.revision.request",
  "quote_delivery.view.record",
  "quote_delivery.accept.record",
  "quote_delivery.revision.record",
  "quote_delivery.view.record",
  "quote_delivery.accept.record",
  "quote_delivery.revision.record",
  "payment.checkout.create"
];

const customerPermissions: Permission[] = [
  "commerce.cart",
  "commerce.checkout",
  "quotes.create",
  "quotes.accept",
  "support.conversation.create",
  "support.message.send",
  "support.ticket.create",
  "service.request.create",
  "service.emergency.escalate",
  "customer.portal.session.create",
  "customer.notification_preferences.update",
  "cart.create",
  "cart.item.add",
  "cart.item.update",
  "cart.item.remove",
  "cart.convert_quote",
  "commerce.quote.create",
  "commerce.quote.accept",
  "quote_document.view.record",
  "quote_document.accept",
  "quote_document.revision.request",
  "payment.checkout.create"
];

const technicianPermissions: Permission[] = [
  "technician.session.create",
  "technician.work_orders.list",
  "technician.work_order.start",
  "technician.checklist.complete",
  "technician.note.add",
  "technician.parts.add",
  "technician.photo.attach",
  "technician.closeout.submit",
  "billing.labor.create",
  "billing.parts.add",
  "photo_quote.intake.create",
  "photo_quote.photo.attach",
  "photo_quote.review.request"
];

const serviceManagerPermissions: Permission[] = [
  "manager.closeout.review",
  "manager.closeout.approve",
  "manager.closeout.reject",
  "service.request.triage",
  "service.work_order.create",
  "service.visit.schedule",
  "service.technician.assign",
  "service.visit.complete",
  "billing.invoice.create",
  "billing.invoice.line_item.add",
  "billing.invoice.submit_review",
  "maintenance.followup.create",
  "maintenance.plan.create",
  "maintenance.plan.activate",
  "maintenance.plan.visit.schedule",
  "maintenance.plan.renew",
  "maintenance.plan.cancel",
  "customer.system.link",
  "notification.queue.create",
  "photo_quote.intake.create",
  "photo_quote.photo.attach",
  "photo_quote.extraction.record",
  "photo_quote.review.request",
  "photo_quote.more_info.request",
  "photo_quote.convert_quote",
  "photo_quote.close"
];

const financePermissions: Permission[] = [
  "billing.invoice.approve",
  "billing.invoice.reject",
  "billing.packet.create",
  "billing.sage_batch.create",
  "billing.sage_batch.mark_ready",
  "pricing.supplier_cost.create",
  "pricing.supplier_cost.update",
  "pricing.supplier_cost.mark_stale",
  "pricing.quote.approve",
  "pricing.quote.reject",
  "pricing.quote.lock",
  "quote_delivery.fail",
  "quote_delivery.expire",
  "quote_delivery.close",

  "payment.request.approve",
  "payment.request.reject",
  "payment.pending.record",
  "payment.succeeded.record",
  "payment.failed.record",
  "payment.canceled.record",
  "payment.refund_review.request",
  "payment.close",
  "fulfillment.plan.create",
  "commerce_invoice.approve",
  "commerce_invoice.reject",
  "commerce_billing_packet.create",
  "accounting_handoff.create",
  "accounting_export.review.submit",
  "accounting_export.ready.mark",
  "accounting_export.manual.mark",
  "accounting_reconciliation.note.add",
  "accounting_export.failed.mark",
  "commerce_payment.reconciliation.record",];

const reportingPermissions: Permission[] = [
  "reporting.kpi_snapshot.create",
  "reporting.ops_report.create"
];

const salesPermissions: Permission[] = [
  "quotes.create",
  "quotes.draft",
  "quotes.send",
  "quotes.accept",
  "pricing.validate",
  "support.conversation.create",
  "support.message.send",
  "support.ticket.create",
  "support.ticket.assign",
  "support.ticket.close",
  "service.request.triage",
  "service.work_order.create",
  "cart.create",
  "cart.item.add",
  "cart.item.update",
  "cart.item.remove",
  "cart.convert_quote",
  "commerce.quote.create",
  "commerce.quote.attach_product",
  "commerce.quote.draft",
  "commerce.quote.submit_review",
  "commerce.quote.send",
  "commerce.order.create",
  "quote_document.create",
  "quote_document.generate_pdf",
  "quote_document.share_link.create",
  "quote_document.view.record",
  "quote_document.accept",
  "quote_document.revision.request",
  "photo_quote.intake.create",
  "photo_quote.photo.attach",
  "photo_quote.review.request",
  "pricing.review.create",
  "pricing.margin_rule.apply",
  "quote_delivery.create",
  "quote_delivery.document.store",
  "quote_delivery.share_token.create",
  "quote_delivery.notification.send",

  "payment.request.create",
  "payment.request.submit_review",
  "fulfillment.plan.create",
  "fulfillment.decision.record",
  "fulfillment.request.create",
  "supplier_po.draft",
  "supplier_po.submit_review",
  "commerce_invoice.draft.create",
  "commerce_invoice.line.add",
  "commerce_invoice.submit_finance_review",
  "commerce_tax_freight.placeholder.record",];

const opsPermissions: Permission[] = [
  "fulfillment.create",
  "fulfillment.packing_slip",
  "ops.sage_export",
  "ops.capital_signal",
  "support.conversation.create",
  "support.message.send",
  "support.ticket.create",
  "support.ticket.assign",
  "support.ticket.close",
  "service.request.triage",
  "service.work_order.create",
  "service.visit.schedule",
  "service.technician.assign",
  "service.visit.complete",
  "service.emergency.escalate",
  "billing.invoice.create",
  "billing.invoice.line_item.add",
  "billing.invoice.submit_review",
  "billing.packet.create",
  "inventory.adjustment.record",
  "maintenance.followup.create",
  "maintenance.plan.create",
  "maintenance.plan.activate",
  "maintenance.plan.visit.schedule",
  "maintenance.plan.renew",
  "maintenance.plan.cancel",
  "notification.preference.create",
  "notification.queue.create",
  "notification.mark_sent",
  "cart.create",
  "cart.item.add",
  "cart.item.update",
  "cart.item.remove",
  "cart.convert_quote",
  "commerce.quote.create",
  "commerce.quote.attach_product",
  "commerce.quote.draft",
  "commerce.quote.submit_review",
  "commerce.quote.approve",
  "commerce.quote.send",
  "commerce.quote.accept",
  "commerce.order.create",
  "quote_document.create",
  "quote_document.generate_pdf",
  "quote_document.share_link.create",
  "quote_document.view.record",
  "quote_document.accept",
  "quote_document.revision.request",
  "photo_quote.intake.create",
  "photo_quote.photo.attach",
  "photo_quote.extraction.record",
  "photo_quote.review.request",
  "photo_quote.more_info.request",
  "photo_quote.convert_quote",
  "photo_quote.close",
  ...reportingPermissions,
  "pricing.review.create",
  "pricing.margin_rule.apply",
  "quote_delivery.create",
  "quote_delivery.document.store",
  "quote_delivery.share_token.create",
  "quote_delivery.notification.send",

  "payment.request.create",
  "payment.request.submit_review",
  "fulfillment.plan.create",
  "fulfillment.decision.record",
  "fulfillment.request.create",
  "supplier_po.draft",
  "supplier_po.submit_review",
  "supplier_po.approve",
  "supplier_po.reject",
  "supplier_po.revision.request",
  "supplier_po.sent_manual.mark",
  "dropship.request.prepare",
  "fulfillment.shipment_pending.mark",
  "fulfillment.shipment_confirmation.record",
  "fulfillment.customer.notify",
  "fulfillment.close",
  "fulfillment.block",
  "commerce_invoice.draft.create",
  "commerce_invoice.line.add",
  "commerce_invoice.submit_finance_review",
  "commerce_tax_freight.placeholder.record",
  "commerce_billing_packet.create",
  "accounting_handoff.create",];

const adminPermissions: Permission[] = [
  "catalog.approve",
  "catalog.publish",
  "catalog.quarantine",
  "pricing.approve",
  "pricing.validate",
  "commerce.cart",
  "commerce.checkout",
  "commerce.order",
  "quotes.create",
  "quotes.draft",
  "quotes.send",
  "quotes.accept",
  "fulfillment.create",
  "fulfillment.packing_slip",
  "ops.sage_export",
  "ops.capital_signal",
  "support.conversation.create",
  "support.message.send",
  "support.ticket.create",
  "support.ticket.assign",
  "support.ticket.close",
  "service.request.create",
  "service.request.triage",
  "service.work_order.create",
  "service.visit.schedule",
  "service.technician.assign",
  "service.visit.complete",
  "service.emergency.escalate",
  "technician.session.create",
  "technician.work_orders.list",
  "technician.work_order.start",
  "technician.checklist.complete",
  "technician.note.add",
  "technician.parts.add",
  "technician.photo.attach",
  "technician.closeout.submit",
  "manager.closeout.review",
  "manager.closeout.approve",
  "manager.closeout.reject",
  "billing.labor.create",
  "billing.parts.add",
  "billing.invoice.create",
  "billing.invoice.line_item.add",
  "billing.invoice.submit_review",
  "billing.invoice.approve",
  "billing.invoice.reject",
  "billing.packet.create",
  "billing.sage_batch.create",
  "billing.sage_batch.mark_ready",
  "inventory.adjustment.record",
  "maintenance.followup.create",
  "customer.portal.session.create",
  "customer.system.link",
  "customer.notification_preferences.update",
  "maintenance.plan.create",
  "maintenance.plan.activate",
  "maintenance.plan.visit.schedule",
  "maintenance.plan.renew",
  "maintenance.plan.cancel",
  "notification.preference.create",
  "notification.queue.create",
  "notification.mark_sent",
  "cart.create",
  "cart.item.add",
  "cart.item.update",
  "cart.item.remove",
  "cart.convert_quote",
  "commerce.quote.create",
  "commerce.quote.attach_product",
  "commerce.quote.draft",
  "commerce.quote.submit_review",
  "commerce.quote.approve",
  "commerce.quote.send",
  "commerce.quote.accept",
  "commerce.order.create",
  "quote_document.create",
  "quote_document.generate_pdf",
  "quote_document.share_link.create",
  "quote_document.view.record",
  "quote_document.accept",
  "quote_document.revision.request",
  "photo_quote.intake.create",
  "photo_quote.photo.attach",
  "photo_quote.extraction.record",
  "photo_quote.review.request",
  "photo_quote.more_info.request",
  "photo_quote.convert_quote",
  "photo_quote.close",
  ...reportingPermissions,
  "pricing.supplier_cost.create",
  "pricing.supplier_cost.update",
  "pricing.supplier_cost.mark_stale",
  "pricing.review.create",
  "pricing.margin_rule.apply",
  "pricing.quote.approve",
  "pricing.quote.reject",
  "pricing.quote.lock",
  "quote_delivery.create",
  "quote_delivery.document.store",
  "quote_delivery.share_token.create",
  "quote_delivery.notification.send",
  "quote_delivery.view.record",
  "quote_delivery.accept.record",
  "quote_delivery.revision.record",
  "quote_delivery.fail",
  "quote_delivery.expire",
  "quote_delivery.close",

  "payment.request.create",
  "payment.request.submit_review",
  "payment.request.approve",
  "payment.request.reject",
  "payment.checkout.create",
  "payment.pending.record",
  "payment.succeeded.record",
  "payment.failed.record",
  "payment.canceled.record",
  "payment.refund_review.request",
  "payment.close",
  "fulfillment.plan.create",
  "fulfillment.decision.record",
  "fulfillment.request.create",
  "fulfillment.shipment_pending.mark",
  "fulfillment.shipment_confirmation.record",
  "fulfillment.customer.notify",
  "fulfillment.close",
  "fulfillment.block",
  "supplier_po.draft",
  "supplier_po.submit_review",
  "supplier_po.approve",
  "supplier_po.reject",
  "supplier_po.revision.request",
  "supplier_po.sent_manual.mark",
  "dropship.request.prepare",
  "commerce_invoice.draft.create",
  "commerce_invoice.line.add",
  "commerce_invoice.submit_finance_review",
  "commerce_invoice.approve",
  "commerce_invoice.reject",
  "commerce_billing_packet.create",
  "commerce_invoice.close",
  "commerce_payment.reconciliation.record",
  "commerce_tax_freight.placeholder.record",
  "accounting_handoff.create",
  "accounting_export.review.submit",
  "accounting_export.ready.mark",
  "accounting_export.manual.mark",
  "accounting_reconciliation.note.add",
  "accounting_export.failed.mark",];

export const permissionMatrix: Record<ActorRole, Permission[]> = {
  PUBLIC: publicPermissions,
  CUSTOMER: customerPermissions,
  SALES: salesPermissions,
  OPS: opsPermissions,
  ADMIN: adminPermissions,
  SUPER_ADMIN: adminPermissions,
  TECHNICIAN: technicianPermissions,
  SERVICE_MANAGER: serviceManagerPermissions,
  FINANCE: financePermissions,
  REPORTING: reportingPermissions
};
