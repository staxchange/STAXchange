import { techSupportWorkflow } from "@stax/workflows";

export default function SupportQueuePage() {
  return (
    <section>
      <h1>Tech Support Queue</h1>
      <p>Human intervention queue for AI support handoffs.</p>
      <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 }}>
        <h2>{techSupportWorkflow.name}</h2>
        <p>{techSupportWorkflow.description}</p>
        <ul>
          {techSupportWorkflow.transitions.map((transition) => (
            <li key={`${transition.from}-${transition.to}-${transition.command}`}>
              {transition.from} → {transition.to} via {transition.command}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
