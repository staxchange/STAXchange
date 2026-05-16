"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  siteAddress: string;
  systemId: string;
  systemType: string;
  issueDescription: string;
  preferredServiceWindow: string;
  siteAccessNotes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  siteAddress: "",
  systemId: "",
  systemType: "UNKNOWN",
  issueDescription: "",
  preferredServiceWindow: "",
  siteAccessNotes: ""
};

export default function ServiceRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/service-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            company: form.company,
            siteAddress: form.siteAddress
          },
          systemId: form.systemId || undefined,
          systemType: form.systemType,
          issueDescription: form.issueDescription,
          preferredServiceWindow: form.preferredServiceWindow,
          siteAccessNotes: form.siteAccessNotes
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Service request failed.");
      }

      setStatus(`${data.data.message} Service request ID: ${data.data.serviceRequest.id}`);
      setForm(initialState);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unknown service request error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card" style={{ marginTop: 24 }}>
      <div className="form">
        <input className="input" placeholder="Name" value={form.name} onChange={(event) => update("name", event.target.value)} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        <input className="input" placeholder="Company" value={form.company} onChange={(event) => update("company", event.target.value)} />
        <input className="input" placeholder="Service site address" value={form.siteAddress} onChange={(event) => update("siteAddress", event.target.value)} />
        <input className="input" placeholder="System ID or serial number if known" value={form.systemId} onChange={(event) => update("systemId", event.target.value)} />

        <select className="input" value={form.systemType} onChange={(event) => update("systemType", event.target.value)}>
          <option value="UNKNOWN">System type unknown</option>
          <option value="IRON_REMOVAL">Iron removal</option>
          <option value="WATER_SOFTENER">Water softener</option>
          <option value="RO_SYSTEM">RO system</option>
          <option value="CARBON_FILTER">Carbon filter</option>
          <option value="CHLORAMINE_TREATMENT">Chloramine treatment</option>
          <option value="SEDIMENT_FILTER">Sediment filter</option>
          <option value="UV_SYSTEM">UV system</option>
          <option value="CHEMICAL_FEED">Chemical feed</option>
        </select>

        <textarea
          className="textarea"
          placeholder="Describe the issue. Example: leak, no water, low pressure, filter replacement, odor, staining, etc."
          value={form.issueDescription}
          onChange={(event) => update("issueDescription", event.target.value)}
        />

        <input
          className="input"
          placeholder="Preferred service window"
          value={form.preferredServiceWindow}
          onChange={(event) => update("preferredServiceWindow", event.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Site access notes"
          value={form.siteAccessNotes}
          onChange={(event) => update("siteAccessNotes", event.target.value)}
        />

        <button className="button" disabled={isSubmitting} onClick={() => void submit()}>
          {isSubmitting ? "Submitting..." : "Submit service request"}
        </button>

        {status ? <p>{status}</p> : null}
      </div>
    </section>
  );
}
