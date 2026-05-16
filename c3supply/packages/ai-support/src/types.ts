export type SupportMessageRole = "user" | "assistant";

export interface SupportMessageDTO {
  id?: string;
  role: SupportMessageRole;
  content: string;
  createdAt?: string;
}

export type SupportSeverity = "LOW" | "NORMAL" | "URGENT" | "EMERGENCY";

export type SupportHandoffReason =
  | "HUMAN_REQUESTED"
  | "SAFETY_OR_DAMAGE_RISK"
  | "INSTALLATION_OR_SIZING"
  | "WARRANTY_OR_ORDER"
  | "QUOTE_OR_PRICING"
  | "PART_IDENTIFICATION"
  | "REPEATED_UNRESOLVED"
  | "AI_UNAVAILABLE"
  | "NONE";

export interface SupportHandoffDecisionDTO {
  required: boolean;
  reason: SupportHandoffReason;
  severity: SupportSeverity;
  summary: string;
  nextAction: "ANSWER" | "COLLECT_DETAILS" | "CREATE_TICKET" | "EMERGENCY_REDIRECT";
}

export interface SupportCustomerDTO {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface SupportTicketDTO {
  id: string;
  conversationId: string;
  status: "NEW" | "HUMAN_REVIEW_REQUIRED" | "ASSIGNED" | "RESOLVED" | "CLOSED";
  severity: SupportSeverity;
  reason: SupportHandoffReason;
  summary: string;
  customer?: SupportCustomerDTO;
  createdAt: string;
}

export interface SupportChatRequestDTO {
  conversationId?: string;
  customer?: SupportCustomerDTO;
  messages: SupportMessageDTO[];
}

export interface SupportChatResponseDTO {
  conversationId: string;
  message: SupportMessageDTO;
  handoff: SupportHandoffDecisionDTO;
  ticket?: SupportTicketDTO;
}

export interface SupportBrandContextDTO {
  brandId: "dwg";
  siteName: "DWG Process Supply";
}

export interface SanitizedSupportChatRequestDTO extends SupportChatRequestDTO {
  brandContext: SupportBrandContextDTO;
  latestUserMessage: string;
  totalCharacters: number;
}

export interface SupportRequestLimits {
  maxMessages: number;
  maxMessageCharacters: number;
  maxTotalCharacters: number;
}
