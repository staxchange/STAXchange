import type { ServiceCustomerDTO, ServiceRequestInput, TreatmentSystemType } from "./types";

const allowedSystemTypes: TreatmentSystemType[] = [
  "IRON_REMOVAL",
  "WATER_SOFTENER",
  "RO_SYSTEM",
  "CARBON_FILTER",
  "CHLORAMINE_TREATMENT",
  "SEDIMENT_FILTER",
  "UV_SYSTEM",
  "CHEMICAL_FEED",
  "UNKNOWN"
];

function sanitizeText(value: unknown, maxLength: number): string {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeEmail(value: unknown): string {
  const email = sanitizeText(value, 254).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Valid customer email is required.");
  }
  return email;
}

function sanitizeCustomer(value: unknown): ServiceCustomerDTO {
  const input = value as Partial<ServiceCustomerDTO> | undefined;

  const customer: ServiceCustomerDTO = {
    name: sanitizeText(input?.name, 120),
    email: sanitizeEmail(input?.email),
    phone: sanitizeText(input?.phone, 40) || undefined,
    company: sanitizeText(input?.company, 160) || undefined,
    siteAddress: sanitizeText(input?.siteAddress, 300) || undefined
  };

  if (!customer.name) {
    throw new Error("Customer name is required.");
  }

  return customer;
}

export function sanitizeServiceRequestInput(value: unknown): ServiceRequestInput {
  const input = value as Partial<ServiceRequestInput> | undefined;

  if (!input || typeof input !== "object") {
    throw new Error("Malformed service request.");
  }

  const issueDescription = sanitizeText(input.issueDescription, 2400);

  if (!issueDescription) {
    throw new Error("Issue description is required.");
  }

  if (issueDescription.length < 8) {
    throw new Error("Issue description is too short.");
  }

  const systemType = input.systemType && allowedSystemTypes.includes(input.systemType)
    ? input.systemType
    : undefined;

  return {
    customer: sanitizeCustomer(input.customer),
    systemId: sanitizeText(input.systemId, 80) || undefined,
    systemType,
    issueDescription,
    preferredServiceWindow: sanitizeText(input.preferredServiceWindow, 160) || undefined,
    siteAccessNotes: sanitizeText(input.siteAccessNotes, 500) || undefined,
    photosProvided: Boolean(input.photosProvided)
  };
}
