import { serviceEmergencyCues } from "@stax/storefront-conversion";

export function EmergencyServiceCTA() {
  return (
    <section className="emergency-cta" aria-label="Service escalation guidance">
      <div>
        <p className="kicker">Pressure rising?</p>
        <h2>Route urgent service concerns to human review.</h2>
        <p>
          Leaks, flood risk, electrical concerns, chemical feed issues, installation questions,
          and sizing decisions require human review.
        </p>
      </div>
      <div className="emergency-cta__grid">
        {serviceEmergencyCues.map((cue) => (
          <a key={cue.id} href={cue.href} className="emergency-cta__card">
            <strong>{cue.label}</strong>
            <p>{cue.body}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
