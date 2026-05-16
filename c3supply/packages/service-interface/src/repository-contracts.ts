import type {
  ServiceClassification,
  ServiceCustomerDTO,
  ServiceRequestStatus,
  TreatmentSystemDTO
} from "./types";

export interface PersistServiceRequestInput {
  brandId: "dwg";
  customer: ServiceCustomerDTO;
  systemId?: string;
  systemType?: string;
  issueDescription: string;
  preferredServiceWindow?: string;
  siteAccessNotes?: string;
  classification: ServiceClassification;
  requestId?: string;
}

export interface PersistedServiceRequestRecord {
  id: string;
  brandId: "dwg";
  status: ServiceRequestStatus;
  customer: ServiceCustomerDTO;
  systemId?: string;
  systemType?: string;
  issueDescription: string;
  classification: ServiceClassification;
  createdAt: string;
  updatedAt: string;
}

export interface TriageServiceRequestInput {
  serviceRequestId: string;
  severity: string;
  category: string;
  reason: string;
  requestId?: string;
}

export interface EmergencyServiceEscalationInput {
  serviceRequestId: string;
  reason: string;
  customerPhone?: string;
  customerEmail?: string;
  requestId?: string;
}

export interface CreateServiceWorkOrderInput {
  serviceRequestId: string;
  priority: string;
  summary: string;
  requestId?: string;
}

export interface ServiceWorkOrderRecord {
  id: string;
  serviceRequestId: string;
  status: "CREATED" | "SCHEDULED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: string;
  summary: string;
  technicianId?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleServiceVisitInput {
  workOrderId: string;
  scheduledStart: string;
  scheduledEnd?: string;
  siteAccessNotes?: string;
  requestId?: string;
}

export interface AssignServiceTechnicianInput {
  workOrderId: string;
  technicianId: string;
  requestId?: string;
}

export interface CompleteServiceVisitInput {
  workOrderId: string;
  technicianId: string;
  findings: string;
  actionsTaken: string;
  followUpRequired?: boolean;
  requestId?: string;
}

export interface TechnicianRecord {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  active: boolean;
  territories: string[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAttachmentRecord {
  id: string;
  serviceRequestId?: string;
  workOrderId?: string;
  bucket: string;
  objectPath: string;
  fileName: string;
  contentType: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface CreateServiceAttachmentUploadInput {
  serviceRequestId?: string;
  workOrderId?: string;
  fileName: string;
  contentType: string;
  sizeBytes?: number;
  uploadedBy?: string;
  requestId?: string;
}

export interface ServiceAttachmentUploadTarget {
  attachment: ServiceAttachmentRecord;
  uploadUrl: string;
  token?: string;
  expiresInSeconds: number;
}

export interface ServiceRepository {
  createServiceRequest(input: PersistServiceRequestInput): Promise<PersistedServiceRequestRecord>;
  triageServiceRequest(input: TriageServiceRequestInput): Promise<void>;
  escalateEmergencyService(input: EmergencyServiceEscalationInput): Promise<void>;
  createServiceWorkOrder(input: CreateServiceWorkOrderInput): Promise<ServiceWorkOrderRecord>;
  scheduleServiceVisit(input: ScheduleServiceVisitInput): Promise<void>;
  assignServiceTechnician(input: AssignServiceTechnicianInput): Promise<void>;
  completeServiceVisit(input: CompleteServiceVisitInput): Promise<void>;
  listServiceRequests(): Promise<PersistedServiceRequestRecord[]>;
  listWorkOrders(): Promise<ServiceWorkOrderRecord[]>;
  lookupTreatmentSystems(input: { systemId?: string; serialNumber?: string; customerEmail?: string }): Promise<TreatmentSystemDTO[]>;
  listTechnicians?(): Promise<TechnicianRecord[]>;
  createServiceAttachmentUpload?(input: CreateServiceAttachmentUploadInput): Promise<ServiceAttachmentUploadTarget>;
  listServiceAttachments?(input: { serviceRequestId?: string; workOrderId?: string }): Promise<ServiceAttachmentRecord[]>;
}

export function getServiceRepository(repositories?: Record<string, unknown>): ServiceRepository | undefined {
  const candidate = repositories?.service;

  if (!candidate || typeof candidate !== "object") {
    return undefined;
  }

  const repository = candidate as Partial<ServiceRepository>;

  if (typeof repository.createServiceRequest !== "function") {
    return undefined;
  }

  return repository as ServiceRepository;
}
