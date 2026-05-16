export type ActorRole = "PUBLIC" | "CUSTOMER" | "SALES" | "OPS" | "ADMIN" | "SUPER_ADMIN" | "TECHNICIAN" | "SERVICE_MANAGER" | "FINANCE" | "REPORTING";

export interface Actor {
  id: string;
  role: ActorRole;
  email?: string;
}
