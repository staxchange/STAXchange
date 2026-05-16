export interface LaunchRoute {
  path: string;
  label: string;
  required: boolean;
  public: boolean;
}

export interface LegalPageCopy {
  title: string;
  updatedAt: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export interface LaunchChecklistItem {
  id: string;
  label: string;
  category: "CONTENT" | "SEO" | "LEGAL" | "ACCESSIBILITY" | "DEPLOYMENT" | "SECURITY";
  required: boolean;
}

export interface LaunchReadinessResult {
  ready: boolean;
  missingRequired: string[];
}
