export function ContactSignalPanel() {
  return (
    <section className="contact-signal-panel">
      <div>
        <p className="kicker">Signal the boiler room</p>
        <h2>Send the right request to the right workflow.</h2>
      </div>
      <div className="contact-signal-panel__grid">
        <a href="/quote">
          <strong>Equipment or system quote</strong>
          <p>For treatment systems, compatibility, sizing, or process supply needs.</p>
        </a>
        <a href="/service">
          <strong>Service request</strong>
          <p>For leaks, low pressure, filter replacement, maintenance, or field service.</p>
        </a>
        <a href="/support">
          <strong>Support intake</strong>
          <p>For general support that may route to a human support handoff.</p>
        </a>
      </div>
    </section>
  );
}
