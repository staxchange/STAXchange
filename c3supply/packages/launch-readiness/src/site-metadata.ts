export const dwgLaunchSiteMetadata = {
  siteName: "DWG Process Supply",
  domain: "dwgprocesssupply.com",
  tagline: "Water Treatment Systems",
  description:
    "Quote-first water treatment systems, service intake, filters, cartridges, and process supply support.",
  theme: "Steampunk boiler-room industrial storefront",
  primaryEmail: "quotes@dwgprocesssupply.com",
  supportEmail: "support@dwgprocesssupply.com"
};

export function pageTitle(title: string): string {
  return `${title} | ${dwgLaunchSiteMetadata.siteName}`;
}

export function canonicalUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `https://${dwgLaunchSiteMetadata.domain}${normalized}`;
}
