import type { CustomerPortalSessionDTO } from "./types";

export function createCustomerPortalSessionDTO(input: {
  id: string;
  customerId: string;
  ttlMinutes?: number;
}): CustomerPortalSessionDTO {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + (input.ttlMinutes ?? 60) * 60_000);

  return {
    id: input.id,
    customerId: input.customerId,
    status: "CREATED",
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}

export function sessionIsActive(session: CustomerPortalSessionDTO, now = new Date()): boolean {
  return session.status === "ACTIVE" && new Date(session.expiresAt).getTime() > now.getTime();
}
