import type { CustomerSystemLinkDTO } from "./types";

export function canCustomerViewSystem(link: CustomerSystemLinkDTO): boolean {
  return link.verified && (link.accessLevel === "VIEW_ONLY" || link.accessLevel === "SERVICE_REQUEST");
}

export function canCustomerRequestService(link: CustomerSystemLinkDTO): boolean {
  return link.verified && link.accessLevel === "SERVICE_REQUEST";
}
