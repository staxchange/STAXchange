"use client";
import { useState } from "react";

export function PhotoUploadPanel({ workOrderId }: { workOrderId: string }) {
  const [status, setStatus] = useState("");
  async function requestUpload() {
    const response = await fetch("/api/upload-photo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workOrderId, technicianId: "tech-demo", fileName: "field-photo.jpg", contentType: "image/jpeg" }) });
    setStatus(response.ok ? "Photo upload placeholder accepted for governed storage flow." : "Photo upload request failed.");
  }
  return <section className="card"><p>Production upload uses signed storage URLs. This placeholder records governed photo intent.</p><button className="button" onClick={() => void requestUpload()}>Prepare photo upload</button>{status ? <p>{status}</p> : null}</section>;
}
