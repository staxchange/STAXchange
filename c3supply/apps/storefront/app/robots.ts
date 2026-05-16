import type { MetadataRoute } from "next";
import { canonicalUrl } from "@stax/launch-readiness";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/catalog",
        "/quote",
        "/service",
        "/support",
        "/contact",
        "/privacy",
        "/terms",
        "/disclaimers",
        "/accessibility"
      ],
      disallow: ["/api/", "/admin", "/technician"]
    },
    sitemap: canonicalUrl("/sitemap.xml")
  };
}
