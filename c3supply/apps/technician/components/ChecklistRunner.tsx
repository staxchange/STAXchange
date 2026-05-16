"use client";
import { useState } from "react";
import type { ChecklistItemDTO } from "@stax/technician-portal";

export function ChecklistRunner({ workOrderId, items }: { workOrderId: string; items: ChecklistItemDTO[] }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  async function complete(checklistItemId: string) {
    await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workOrderId, checklistItemId, technicianId: "tech-demo" })
    });
    setCompleted((current) => ({ ...current, [checklistItemId]: true }));
  }

  return (
    <section className="card">
      {items.map((item) => (
        <p key={item.id}>
          <button className="button" onClick={() => void complete(item.id)} disabled={completed[item.id]}>
            {completed[item.id] ? "Completed" : "Complete"}
          </button>{" "}{item.label}
        </p>
      ))}
    </section>
  );
}
