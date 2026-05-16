import { createPageMetadata } from "../metadata";

export const metadata = createPageMetadata({ title: "Request a Quote", description: "Request a DWG quote for treatment systems, process supply, parts, or quote-first equipment workflow.", path: "/quote" });

export default function QuotePage() {
  return (
    <main className="page">
      <p className="kicker">Quote-first workflow</p>
      <h1>Request a quote</h1>
      <p>
        Large systems and quote-required cart items route through commerce quote review and governed command execution before fulfillment.
      </p>

      <div className="quote-mechanism" aria-label="Quote workflow indicator">
        <div className="quote-mechanism__row"><span className="quote-mechanism__bolt" /><p>Intake → human review → quote draft → approval.</p></div>
      </div>

      <form className="form" action="/api/quote" method="post">
        <input className="input" name="company" placeholder="Company" />
        <input className="input" name="name" placeholder="Name" required />
        <input className="input" name="email" placeholder="Email" type="email" required />
        <input className="input" name="phone" placeholder="Phone" />
        <textarea className="textarea" name="details" placeholder="Tell us about the treatment system, water issue, or process supply need." required />
        <button className="button" type="submit">
          Submit quote request
        </button>
      </form>
    </main>
  );
}
