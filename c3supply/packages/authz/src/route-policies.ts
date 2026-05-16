import type { RoutePolicy } from "./types";

export const customerRoutePolicies: RoutePolicy[] = [
  {
    pattern: "/",
    allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    surface: "customer",
    description: "Customer dashboard requires customer or staff role."
  },
  {
    pattern: "/systems",
    allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    surface: "customer",
    description: "Linked systems require authenticated customer."
  },
  {
    pattern: "/service-history",
    allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    surface: "customer",
    description: "Customer-visible service history."
  },
  {
    pattern: "/invoices",
    allowedRoles: ["CUSTOMER", "FINANCE", "ADMIN", "SUPER_ADMIN"],
    surface: "customer",
    description: "Customer invoice view requires customer or finance staff."
  }
];

export const adminRoutePolicies: RoutePolicy[] = [
  {
    pattern: "/",
    allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"],
    surface: "admin",
    description: "Admin dashboard requires staff."
  },
  {
    pattern: "/service",
    allowedRoles: ["OPS", "SERVICE_MANAGER", "ADMIN", "SUPER_ADMIN"],
    surface: "admin",
    description: "Service queue requires ops/service manager/admin."
  },
  {
    pattern: "/billing",
    allowedRoles: ["FINANCE", "OPS", "ADMIN", "SUPER_ADMIN"],
    surface: "admin",
    description: "Billing requires finance/ops/admin."
  },
  {
    pattern: "/billing/simply-accounting-export",
    allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"],
    surface: "admin",
    description: "Simply Accounting export review is finance/admin only."
  },
  {
    pattern: "/reporting",
    allowedRoles: ["REPORTING", "ADMIN", "SUPER_ADMIN"],
    surface: "admin",
    description: "Reporting requires reporting/admin role."
  }
];

export const technicianRoutePolicies: RoutePolicy[] = [
  {
    pattern: "/",
    allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "ADMIN", "SUPER_ADMIN"],
    surface: "technician",
    description: "Technician dashboard."
  },
  {
    pattern: "/work-orders",
    allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"],
    surface: "technician",
    description: "Assigned work orders."
  }
];

export const storefrontRoutePolicies: RoutePolicy[] = [
  {
    pattern: "/service",
    allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"],
    surface: "storefront",
    description: "Public service intake."
  },
  {
    pattern: "/support",
    allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"],
    surface: "storefront",
    description: "Public support intake."
  }
];

export const allRoutePolicies = [
  ...customerRoutePolicies,
  ...adminRoutePolicies,
  ...technicianRoutePolicies,
  ...storefrontRoutePolicies
];
