export type BoilerIconName =
  | "gauge"
  | "valve"
  | "pipe"
  | "cartridge"
  | "softener"
  | "ro"
  | "iron"
  | "chloramine"
  | "service"
  | "quote";

export type VisualIntensity = "low" | "medium" | "high" | "critical";

export interface BoilerIconDescriptor {
  name: BoilerIconName;
  label: string;
  description: string;
}

export interface CategoryVisualDescriptor {
  slug: string;
  icon: BoilerIconName;
  gaugeLabel: string;
  accent: "copper" | "brass" | "patina" | "valve";
}

export interface ServiceStatusVisual {
  status: string;
  label: string;
  intensity: VisualIntensity;
  gaugePercent: number;
}
