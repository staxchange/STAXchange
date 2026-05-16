import { createPageMetadata } from "../metadata";

export const metadata = createPageMetadata({ title: "Contact DWG", description: "Contact DWG Process Supply for quote, service, and support workflows.", path: "/contact" });

import { ContactSignalPanel } from "../../components/ContactSignalPanel";
import { dwgBrand } from "@stax/brand-dwg";
import { RivetPanel } from "../../components/RivetPanel";

export default function ContactPage() {
  return (
    <main className="page">
      <p className="kicker">Contact</p>
      <h1>Contact {dwgBrand.name}</h1>
      <RivetPanel>
        <p>Email: <a href={`mailto:${dwgBrand.contact.quoteEmail}`}>{dwgBrand.contact.quoteEmail}</a></p>
        <p>Phone: {dwgBrand.contact.phone}</p>
        <p>{dwgBrand.contact.serviceArea}</p>
      </RivetPanel>
          <ContactSignalPanel />
    </main>
  );
}
