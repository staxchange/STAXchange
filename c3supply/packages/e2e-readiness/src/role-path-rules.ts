import type { RolePathResultDTO } from "./types";

export function rolePathRules(role: string): RolePathResultDTO {
  const baseForbidden = ["supplier cost", "accounting export trigger", "supplier PO approval"];
  if (role === "PUBLIC" || role === "CUSTOMER") {
    return { role, allowedAreas: ["cart/quote", "quote view", "payment", "safe order status"], forbiddenAreas: baseForbidden };
  }
  if (role === "TECHNICIAN") {
    return { role, allowedAreas: ["photo quote", "assigned work orders"], forbiddenAreas: ["pricing approval", "accounting handoff", "supplier PO approval"] };
  }
  if (role === "FINANCE") {
    return { role, allowedAreas: ["invoice review", "accounting handoff", "payment review"], forbiddenAreas: ["auto-post accounting"] };
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return { role, allowedAreas: ["all governed areas with audit"], forbiddenAreas: ["unaudited override"] };
  }
  return { role, allowedAreas: ["limited ops workflow"], forbiddenAreas: baseForbidden };
}
