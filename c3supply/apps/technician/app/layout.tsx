import "./globals.css";
import type { Metadata } from "next";
import { TechnicianNav } from "../components/TechnicianNav";

export const metadata: Metadata = {
  title: "DWG Technician Portal",
  description: "Governed field service work order portal."
};

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <TechnicianNav />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
