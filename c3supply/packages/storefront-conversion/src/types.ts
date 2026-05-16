export interface TrustPillar {
  id: string;
  label: string;
  body: string;
}

export interface FunnelStep {
  id: string;
  label: string;
  body: string;
  href?: string;
}

export interface EmergencyCue {
  id: string;
  label: string;
  body: string;
  href: string;
}

export interface StorefrontSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphTitle: string;
  openGraphDescription: string;
}
