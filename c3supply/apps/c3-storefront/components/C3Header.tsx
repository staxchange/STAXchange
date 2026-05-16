import { c3Brand } from "@stax/c3-supply";

export function C3Header() {
  return (
    <header className="c3-header">
      <div className="c3-header__inner">
        <a href="/"><strong>{c3Brand.name}</strong></a>
        <nav className="c3-nav">
          {c3Brand.navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
      </div>
    </header>
  );
}
