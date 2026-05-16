export interface SmokeTestTarget {
  path: string;
  method: "GET" | "POST";
  expectedStatus: number[];
  surface: "storefront" | "admin" | "technician" | "customer";
}

export const storefrontSmokeTargets: SmokeTestTarget[] = [
  { surface: "storefront", method: "GET", path: "/", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/catalog", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/quote", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/service", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/support", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/privacy", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/terms", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/robots.txt", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/sitemap.xml", expectedStatus: [200] },
  { surface: "storefront", method: "GET", path: "/api/health", expectedStatus: [200] }
];

export const apiSmokeTargets: SmokeTestTarget[] = [
  { surface: "storefront", method: "POST", path: "/api/service-request", expectedStatus: [200, 400] },
  { surface: "storefront", method: "POST", path: "/api/support-chat", expectedStatus: [200, 400, 500] },
  { surface: "storefront", method: "POST", path: "/api/service-system-lookup", expectedStatus: [200] }
];
