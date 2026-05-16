import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DWG Admin Shell",
  description: "Governed admin shell for controlled ecommerce workflows."
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#f8fafc" }}>
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
