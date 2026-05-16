import type { MetadataRoute } from "next";
import { canonicalUrl, requiredLaunchRoutes } from "@stax/launch-readiness";

export default function sitemap(): MetadataRoute.Sitemap {
  return requiredLaunchRoutes
    .filter((route) => route.public)
    .map((route) => ({
      url: canonicalUrl(route.path),
      lastModified: new Date(),
      changeFrequency: route.path === "/" ? "weekly" : "monthly",
      priority: route.path === "/" ? 1 : 0.7
    }));
}
