import { serviceStatusVisual } from "@stax/visual-system";

export function ServiceStatusGauge({ status }: { status: string }) {
  const visual = serviceStatusVisual(status);

  return (
    <article className={`service-status-gauge service-status-gauge--${visual.intensity}`}>
      <div
        className="service-status-gauge__dial"
        style={{ "--gauge-percent": `${visual.gaugePercent}%` } as React.CSSProperties}
      >
        <span />
      </div>
      <div>
        <p className="kicker">{visual.label}</p>
        <h3>{status}</h3>
      </div>
    </article>
  );
}
