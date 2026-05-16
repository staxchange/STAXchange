export type PaymentProvider = "STRIPE";
export type PaymentStatus =
  | "PAYMENT_REQUEST_DRAFTED"
  | "PAYMENT_REVIEW_REQUIRED"
  | "PAYMENT_REQUEST_APPROVED"
  | "CHECKOUT_SESSION_CREATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "PAYMENT_CANCELED"
  | "REFUND_REVIEW_REQUESTED"
  | "PAYMENT_CLOSED";

export interface PaymentRequestDTO {
  id: string;
  quoteId: string;
  orderId?: string;
  customerId?: string;
  customerEmail?: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  currency: "CAD" | "USD";
  amountCents: number;
  depositRequired: boolean;
  depositAmountCents?: number;
  quoteAccepted: boolean;
  pricingApproved: boolean;
  pricingLocked: boolean;
  quoteDocumentApproved: boolean;
  createdAt: string;
}

export interface QuotePaymentDTO {
  id: string;
  quoteId: string;
  paymentRequestId: string;
  status: PaymentStatus;
  amountCents: number;
  currency: "CAD" | "USD";
}

export interface StripeCheckoutSessionDTO {
  id: string;
  paymentRequestId: string;
  stripeCheckoutSessionId?: string;
  url?: string;
  status: PaymentStatus;
}

export interface StripePaymentEventDTO {
  id: string;
  provider: "STRIPE";
  stripeEventId: string;
  paymentRequestId?: string;
  stripePaymentIntentId?: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentAuditDTO {
  id: string;
  paymentRequestId: string;
  action: string;
  actorId: string;
  createdAt: string;
}

export interface DepositRequirementDTO {
  required: boolean;
  depositAmountCents?: number;
  currency: "CAD" | "USD";
}

export interface RefundReviewRequestDTO {
  id: string;
  paymentRequestId: string;
  reason: string;
  requestedBy: string;
  createdAt: string;
}
