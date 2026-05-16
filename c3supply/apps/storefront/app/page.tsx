import { EmergencyServiceCTA } from "../components/EmergencyServiceCTA";
import { QuoteFunnelCards } from "../components/QuoteFunnelCards";
import { TrustStrip } from "../components/TrustStrip";
import { dwgBrand, dwgFeaturedCategories } from "@stax/brand-dwg";
import { IndustrialBadge } from "../components/IndustrialBadge";
import { PipeDivider } from "../components/PipeDivider";
import { PressureGaugeCard } from "../components/PressureGaugeCard";
import { ServiceStatusGauge } from "../components/ServiceStatusGauge";
import { RivetPanel } from "../components/RivetPanel";

export default function HomePage() {
  return (
    <>
      <section className="hero-shell">
        <div className="header-inner hero">
          <IndustrialBadge>Boiler-room grade water treatment supply</IndustrialBadge>
          <h1>{dwgBrand.hero.title}</h1>
          <p>
            Quote-first treatment systems, mechanical-room components, filters, cartridges,
            service intake, and industrial support workflows with a brass-and-steam operating feel.
          </p>
          <div className="cta-row">
            <a className="button" href="/quote">
              Request a Quote
            </a>
            <a className="button secondary" href="/service">
              Request Service
            </a>
            <a className="button secondary" href="/catalog">
              Open Catalog
            </a>
          </div>
        </div>
      </section>

      <main className="page">
        <TrustStrip />
        <RivetPanel>
          <p className="kicker">Mechanical room catalog</p>
          <h2>Systems, parts, and service intake built around human review.</h2>
          <p>
            DWG keeps the storefront practical: big systems stay quote-first, service issues route
            through human review, and commodity items can be prepared for controlled checkout later.
          </p>
        </RivetPanel>

        <div className="grid" style={{ marginTop: 18 }}>
          <ServiceStatusGauge status="HUMAN_REVIEW_REQUIRED" />
          <ServiceStatusGauge status="SCHEDULED" />
          <ServiceStatusGauge status="COMPLETED" />
        </div>

        <PipeDivider />

        <QuoteFunnelCards mode="quote" />

        <PipeDivider />

        <div className="grid">
          {dwgFeaturedCategories.map((category) => (
            <PressureGaugeCard
              key={category.slug}
              label="Treatment category"
              value={category.name}
              detail={category.summary}
              href={`/catalog#${category.slug}`}
            />
          ))}
        </div>
              <EmergencyServiceCTA />
      </main>
    </>
  );
}
