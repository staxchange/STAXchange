import { canonicalUrl, storefrontSeo } from "@stax/storefront-conversion";

export function createPageMetadata(input: {
  title: string;
  description: string;
  path?: string;
}) {
  const seo = storefrontSeo(input);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl(seo.canonicalPath)
    },
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      url: canonicalUrl(seo.canonicalPath),
      siteName: "DWG Process Supply",
      type: "website"
    }
  };
}
