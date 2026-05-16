import SupportChat from "./SupportChat";

export default function SupportPage() {
  return (
    <main className="page">
      <p className="kicker">Tech Support</p>
      <h1>DWG support assistant</h1>
      <p>
        Start with the assistant for basic intake. Installation, sizing, warranty, order, safety, quote,
        compatibility, and unresolved technical issues are routed to human support.
      </p>
      <SupportChat />
    </main>
  );
}
