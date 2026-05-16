import "./globals.css";
import type { Metadata } from "next";
import { c3Brand } from "@stax/c3-supply";
import { C3Header } from "../components/C3Header";
import { C3Footer } from "../components/C3Footer";

export const metadata: Metadata = {
  title: c3Brand.lane,
  description: c3Brand.description,
  metadataBase: new URL("https://c3supply.co")
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><C3Header />{children}<C3Footer /></body></html>;
}
