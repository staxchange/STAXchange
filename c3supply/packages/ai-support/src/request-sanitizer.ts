import type {
  SanitizedSupportChatRequestDTO,
  SupportCustomerDTO,
  SupportMessageDTO,
  SupportRequestLimits
} from "./types";

export const defaultSupportRequestLimits: SupportRequestLimits = {
  maxMessages: 12,
  maxMessageCharacters: 2_000,
  maxTotalCharacters: 10_000
};

const allowedRoles = new Set(["user", "assistant"]);
const conversationIdPattern = /^support-[a-zA-Z0-9-]{8,80}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalCleanString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function cleanRequiredString(value: unknown, maxLength: number, fieldName: string): string {
  if (typeof value !== "string") throw new Error(`${fieldName} is required.`);
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  if (!cleaned) throw new Error(`${fieldName} is required.`);
  if (cleaned.length > maxLength) {
    throw new Error(`${fieldName} exceeds ${maxLength} characters.`);
  }
  return cleaned;
}

function sanitizeEmail(value: unknown): string | undefined {
  const email = optionalCleanString(value, 254)?.toLowerCase();
  if (!email) return undefined;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("customer.email is invalid.");
  }
  return email;
}

function sanitizeCustomer(value: unknown): SupportCustomerDTO | undefined {
  if (!isRecord(value)) return undefined;

  const customer: SupportCustomerDTO = {
    name: optionalCleanString(value.name, 120),
    email: sanitizeEmail(value.email),
    phone: optionalCleanString(value.phone, 40),
    company: optionalCleanString(value.company, 160)
  };

  return Object.fromEntries(
    Object.entries(customer).filter(([, entryValue]) => typeof entryValue === "string" && entryValue.length > 0)
  ) as SupportCustomerDTO;
}

function sanitizeConversationId(value: unknown): string | undefined {
  const id = optionalCleanString(value, 96);
  if (!id) return undefined;

  if (!conversationIdPattern.test(id)) {
    throw new Error("conversationId is invalid.");
  }

  return id;
}

function sanitizeMessage(value: unknown, index: number, limits: SupportRequestLimits): SupportMessageDTO {
  if (!isRecord(value)) throw new Error(`messages[${index}] must be an object.`);

  const role = value.role;
  if (typeof role !== "string" || !allowedRoles.has(role)) {
    throw new Error(`messages[${index}].role must be user or assistant.`);
  }

  const content = cleanRequiredString(value.content, limits.maxMessageCharacters, `messages[${index}].content`);

  return {
    id: optionalCleanString(value.id, 96),
    role: role as SupportMessageDTO["role"],
    content,
    createdAt: optionalCleanString(value.createdAt, 64)
  };
}

export function sanitizeSupportChatRequest(
  input: unknown,
  limits: SupportRequestLimits = defaultSupportRequestLimits
): SanitizedSupportChatRequestDTO {
  if (!isRecord(input)) throw new Error("Request body must be an object.");

  if (!Array.isArray(input.messages)) {
    throw new Error("messages must be an array.");
  }

  if (input.messages.length === 0) {
    throw new Error("At least one support message is required.");
  }

  if (input.messages.length > limits.maxMessages) {
    throw new Error(`Support chat accepts at most ${limits.maxMessages} messages.`);
  }

  const messages = input.messages.map((message, index) => sanitizeMessage(message, index, limits));
  const totalCharacters = messages.reduce((total, message) => total + message.content.length, 0);

  if (totalCharacters > limits.maxTotalCharacters) {
    throw new Error(`Support chat accepts at most ${limits.maxTotalCharacters} total characters.`);
  }

  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  if (!latestUserMessage) {
    throw new Error("At least one user message is required.");
  }

  return {
    conversationId: sanitizeConversationId(input.conversationId),
    customer: sanitizeCustomer(input.customer),
    messages,
    latestUserMessage,
    totalCharacters,
    brandContext: {
      brandId: "dwg",
      siteName: "DWG Process Supply"
    }
  };
}
