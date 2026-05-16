"use client";
import { useState } from "react";

export function PartsUsedForm({ workOrderId }: { workOrderId: string }) {
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  async function submit() {
    const response = await fetch("/api/parts-used", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workOrderId, technicianId: "tech-demo", description, sku, quantity }) });
    setStatus(response.ok ? "Part used recorded for inventory/billing review." : "Failed to record part.");
  }
  return <section className="card"><input className="input" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} /><input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><input className="input" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /><button className="button" onClick={() => void submit()}>Record part</button>{status ? <p>{status}</p> : null}</section>;
}
