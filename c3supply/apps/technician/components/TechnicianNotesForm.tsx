"use client";
import { useState } from "react";

export function TechnicianNotesForm({ workOrderId }: { workOrderId: string }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  async function submit() {
    const response = await fetch("/api/technician-note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workOrderId, technicianId: "tech-demo", note }) });
    setStatus(response.ok ? "Visit note recorded for manager review." : "Failed to record note.");
    setNote("");
  }
  return <section className="card"><textarea className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Technician visit note" /><button className="button" onClick={() => void submit()}>Add note</button>{status ? <p>{status}</p> : null}</section>;
}
