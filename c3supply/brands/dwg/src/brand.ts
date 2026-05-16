import type { BrandDress } from "@stax/core-contracts";

export const dwgBrand: BrandDress = {
  id: "dwg",
  name: "DWG Process Supply",
  legalName: "DWG Process Supply",
  tagline: "Water Treatment Systems",
  positioning: "Process supply. Water treatment. Quote-first execution.",
  description: "DWG Process Supply provides quote-first water treatment systems, components, and process supply support.",
  domain: "dwgprocesssupply.com",
  hero: {
    title: "Boiler-room grade water treatment supply without the guesswork.",
    body: "A brass-and-steam themed ecommerce shell for treatment systems, process supply, filters, cartridges, service intake, and quote-first equipment workflows."
  },
  contact: {
    quoteEmail: "quotes@dwgprocesssupply.com",
    phone: "(000) 000-0000",
    serviceArea: "Serving commercial, residential, and industrial water treatment buyers."
  },
  navigation: [
    { label: "Catalog", href: "/catalog" },
    { label: "Quote", href: "/quote" },
    { label: "Support", href: "/support" },
    { label: "Service", href: "/service" },
    { label: "Contact", href: "/contact" }
  ],
  footer: "Powered by STAX Marketing Co."
};
