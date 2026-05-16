"use client";
import { useState } from "react";

export function CloseoutForm({ workOrderId }: { workOrderId: string }) {
  const [findings, setFindings] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [status, setStatus] = useState("");
  async function submit() {
    const response = await fetch("/api/closeout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workOrderId, technicianId: "tech-demo", findings, actionsTaken, followUpRequired: false }) });
    setStatus(response.ok ? "Closeout submitted. Manager review required." : "Closeout failed.");
  }
  return <section className="card"><textarea className="textarea" placeholder="Findings" value={findings} onChange={(e) => setFindings(e.target.value)} /><textarea className="textarea" placeholder="Actions taken" value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} /><button className="button" onClick={() => void submit()}>Submit closeout</button>{status ? <p>{status}</p> : null}</section>;
}
