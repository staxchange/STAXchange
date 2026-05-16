import type { LegalPageCopy } from "@stax/launch-readiness";

export function LegalPage({ copy }: { copy: LegalPageCopy }) {
  return (
    <main className="page legal-page">
      <p className="kicker">DWG Process Supply</p>
      <h1>{copy.title}</h1>
      <p>Last updated: {copy.updatedAt}</p>

      <div className="legal-page__sections">
        {copy.sections.map((section) => (
          <section className="rivet-panel" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
