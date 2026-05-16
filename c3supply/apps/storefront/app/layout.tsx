import "./globals.css";
import type { Metadata } from "next";
import { dwgBrand, dwgBoilerRoomTheme } from "@stax/brand-dwg";
import { MobileBoilerNav } from "../components/MobileBoilerNav";
import { StickyActionBar } from "../components/StickyActionBar";

export const metadata: Metadata = {
  title: `${dwgBrand.name} — ${dwgBrand.tagline}`,
  description: `${dwgBrand.description} Theme: ${dwgBoilerRoomTheme.name}.`
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="header-inner">
            <nav className="nav" aria-label="Primary navigation">
              <div className="brand-cluster"><a className="brand-mark" href="/">
                {dwgBrand.name}
              </a><MobileBoilerNav /></div>
              <div className="nav-links">
                {dwgBrand.navigation.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </header>
        {children}
        <StickyActionBar />
        <footer className="footer">
          <div className="footer-inner">
            <strong>{dwgBrand.name}</strong>
            <p>{dwgBrand.footer}</p>
            <nav className="footer-links" aria-label="Legal links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/disclaimers">Disclaimers</a>
              <a href="/accessibility">Accessibility</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
