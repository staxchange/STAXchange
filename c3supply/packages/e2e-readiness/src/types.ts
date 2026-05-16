export interface GoldenPathStepDTO {
  id: string;
  label: string;
  requiredPriorState?: string;
  commandGatewayRequired: boolean;
  publicSurfaceSafe: boolean;
}

export interface GoldenPathFixtureDTO {
  id: string;
  name: string;
  steps: GoldenPathStepDTO[];
}

export interface WorkflowIntegrityResultDTO {
  ok: boolean;
  missingStates: string[];
  reason: string;
}

export interface RolePathResultDTO {
  role: string;
  allowedAreas: string[];
  forbiddenAreas: string[];
}

export interface PublicSurfaceSafetyResultDTO {
  ok: boolean;
  supplierCostVisible: boolean;
  dwgInternalLanguageVisible: boolean;
  collectiblesDriftVisible: boolean;
}

export interface ReleaseCandidateChecklistDTO {
  id: string;
  label: string;
  required: boolean;
  complete: boolean;
}
