import type { BoilerIconName } from "@stax/visual-system";

export function BoilerIcon({ name, label }: { name: BoilerIconName; label?: string }) {
  if (name === "valve") return <ValveIcon label={label} />;
  if (name === "pipe") return <PipeIcon label={label} />;
  if (name === "cartridge") return <CartridgeIcon label={label} />;
  if (name === "softener") return <SoftenerIcon label={label} />;
  if (name === "ro") return <RoIcon label={label} />;
  if (name === "iron") return <IronIcon label={label} />;
  if (name === "chloramine") return <ChloramineIcon label={label} />;
  if (name === "service") return <ServiceIcon label={label} />;
  if (name === "quote") return <QuoteIcon label={label} />;
  return <GaugeIcon label={label} />;
}

function IconShell({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <svg className="boiler-icon" viewBox="0 0 96 96" role={label ? "img" : "presentation"} aria-label={label}>
      {children}
    </svg>
  );
}

function GaugeIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <circle cx="48" cy="48" r="34" />
      <circle cx="48" cy="48" r="22" className="boiler-icon__glass" />
      <path d="M48 48 L64 35" className="boiler-icon__needle" />
      <path d="M30 63 Q48 74 66 63" />
    </IconShell>
  );
}

function ValveIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <path d="M16 50 H36 L48 34 L60 50 H80" />
      <path d="M34 66 H62 L54 50 H42 Z" />
      <path d="M48 34 V18" />
      <path d="M32 18 H64" />
    </IconShell>
  );
}

function PipeIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <path d="M14 40 H58 C70 40 78 48 78 60 V76" />
      <path d="M14 56 H58 C62 56 62 60 62 64 V76" />
      <circle cx="22" cy="48" r="6" />
      <circle cx="70" cy="70" r="6" />
    </IconShell>
  );
}

function CartridgeIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <rect x="32" y="14" width="32" height="68" rx="9" />
      <path d="M38 28 H58" />
      <path d="M38 42 H58" />
      <path d="M38 56 H58" />
      <path d="M38 70 H58" />
    </IconShell>
  );
}

function SoftenerIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <rect x="32" y="12" width="32" height="72" rx="16" />
      <path d="M40 24 H56" />
      <path d="M36 66 Q48 74 60 66" />
      <circle cx="48" cy="44" r="9" className="boiler-icon__glass" />
    </IconShell>
  );
}

function RoIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <rect x="16" y="28" width="64" height="18" rx="9" />
      <rect x="16" y="54" width="64" height="18" rx="9" />
      <path d="M24 46 V54" />
      <path d="M72 46 V54" />
      <path d="M34 37 H62" />
      <path d="M34 63 H62" />
    </IconShell>
  );
}

function IronIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <path d="M26 74 L48 14 L70 74 Z" />
      <path d="M38 54 H58" />
      <path d="M34 66 H62" />
      <circle cx="48" cy="42" r="6" className="boiler-icon__glass" />
    </IconShell>
  );
}

function ChloramineIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <circle cx="36" cy="42" r="18" />
      <circle cx="58" cy="50" r="22" />
      <path d="M30 70 C42 58 54 78 70 60" />
      <path d="M24 24 C42 34 54 16 72 30" />
    </IconShell>
  );
}

function ServiceIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <path d="M28 72 L60 40" />
      <path d="M58 20 C66 20 72 26 72 34 L62 32 L56 38 L58 48 C50 48 44 42 44 34 C44 26 50 20 58 20 Z" />
      <circle cx="26" cy="74" r="8" />
    </IconShell>
  );
}

function QuoteIcon({ label }: { label?: string }) {
  return (
    <IconShell label={label}>
      <path d="M28 14 H58 L72 28 V82 H28 Z" />
      <path d="M58 14 V30 H72" />
      <path d="M38 42 H62" />
      <path d="M38 54 H62" />
      <path d="M38 66 H54" />
    </IconShell>
  );
}
