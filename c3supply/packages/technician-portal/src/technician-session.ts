import type { TechnicianSessionDTO } from "./types";

export function createTechnicianSessionDTO(input: { technicianId: string; actorId: string; ttlMinutes?: number }): TechnicianSessionDTO {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (input.ttlMinutes ?? 480) * 60_000);

  return {
    id: crypto.randomUUID(),
    technicianId: input.technicianId,
    actorId: input.actorId,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
}
