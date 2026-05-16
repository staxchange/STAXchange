import { c3Brand } from "@stax/c3-supply";

export function C3Footer() {
  return (
    <footer className="c3-footer">
      <div className="c3-footer__inner">
        <span>{c3Brand.lane}</span>
        <span>{c3Brand.attribution}</span>
      </div>
    </footer>
  );
}
