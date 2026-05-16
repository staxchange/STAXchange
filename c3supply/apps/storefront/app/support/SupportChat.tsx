"use client";

import { FormEvent, useState } from "react";
import type { SupportChatResponseDTO, SupportMessageDTO } from "@stax/ai-support";

type Status = "idle" | "sending" | "error";

export default function SupportChat() {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<SupportMessageDTO[]>([
    {
      role: "assistant",
      content: "Tell me what product or system is involved and what support you need. If this is a leak, electrical issue, chemical exposure, contamination, or safety concern, contact a local emergency professional immediately."
    }
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [handoffNotice, setHandoffNotice] = useState<string | undefined>();


  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || status === "sending") return;

    const nextMessages: SupportMessageDTO[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setStatus("sending");
    setHandoffNotice(undefined);

    try {
      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, messages: nextMessages })
      });

      if (!response.ok) {
        throw new Error("Support chat request failed.");
      }

      const data = (await response.json()) as SupportChatResponseDTO;
      setConversationId(data.conversationId);
      setMessages([...nextMessages, data.message]);

      if (data.handoff.required || data.ticket) {
        setHandoffNotice(
          data.ticket
            ? `Human support handoff prepared. Ticket: ${data.ticket.id}`
            : "Human support handoff is recommended for this issue."
        );
      }

      setStatus("idle");
    } catch {
      setStatus("error");
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "I could not complete the AI support step. Please email support@dwgprocesssupply.com with the product/model, issue, photos, and order or quote number."
        }
      ]);
    }
  }

  return (
    <section className="card" aria-label="Support chat">
      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            style={{
              padding: 12,
              borderRadius: 14,
              background: message.role === "user" ? "#e0f2fe" : "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >
            <strong>{message.role === "user" ? "You" : "DWG Assistant"}</strong>
            <p style={{ marginBottom: 0 }}>{message.content}</p>
          </div>
        ))}
      </div>

      {handoffNotice ? (
        <div style={{ border: "1px solid #bae6fd", borderRadius: 14, padding: 12, marginBottom: 16 }}>
          <strong>Human handoff</strong>
          <p style={{ marginBottom: 0 }}>{handoffNotice}</p>
        </div>
      ) : null}

      <form className="form" onSubmit={onSubmit}>
        <textarea
          className="textarea"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe the support issue, product/model, order or quote number, and urgency."
        />
        <button className="button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send to support assistant"}
        </button>
        {status === "error" ? <p role="alert">Support assistant failed. Please email support directly.</p> : null}
      </form>
    </section>
  );
}
