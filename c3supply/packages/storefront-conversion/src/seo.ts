import type { StorefrontSeoConfig } from "./types";

const siteName = "DWG Process Supply";
const domain = "dwgprocesssupply.com";

export function storefrontSeo(input: {
  title: string;
  description: string;
  path?: string;
}): StorefrontSeoConfig {
  const canonicalPath = input.path ?? "/";

  return {
    title: `${input.title} | ${siteName}`,
    description: input.description,
    canonicalPath,
    openGraphTitle: `${input.title} — Boiler-room water treatment supply`,
    openGraphDescription: input.description
  };
}

export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `https://${domain}${normalized}`;
}
