import type { TreatmentSystemDTO } from "./types";
import type {
  AssignServiceTechnicianInput,
  CompleteServiceVisitInput,
  CreateServiceWorkOrderInput,
  EmergencyServiceEscalationInput,
  PersistedServiceRequestRecord,
  PersistServiceRequestInput,
  ScheduleServiceVisitInput,
  ServiceRepository,
  ServiceWorkOrderRecord,
  TriageServiceRequestInput
} from "./repository-contracts";

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class InMemoryServiceRepository implements ServiceRepository {
  private serviceRequests: PersistedServiceRequestRecord[] = [];
  private workOrders: ServiceWorkOrderRecord[] = [];
  private treatmentSystems: TreatmentSystemDTO[] = [];
  private attachments: import("./repository-contracts").ServiceAttachmentRecord[] = [];
  private technicians: import("./repository-contracts").TechnicianRecord[] = [];

  constructor(seed?: { treatmentSystems?: TreatmentSystemDTO[] }) {
    this.treatmentSystems = seed?.treatmentSystems ?? [];
  }

  async createServiceRequest(input: PersistServiceRequestInput): Promise<PersistedServiceRequestRecord> {
    const now = new Date().toISOString();
    const record: PersistedServiceRequestRecord = {
      id: id("svc"),
      brandId: input.brandId,
      status: "NEW",
      customer: input.customer,
      systemId: input.systemId,
      systemType: input.systemType,
      issueDescription: input.issueDescription,
      classification: input.classification,
      createdAt: now,
      updatedAt: now
    };

    this.serviceRequests.push(record);
    return record;
  }

  async triageServiceRequest(input: TriageServiceRequestInput): Promise<void> {
    const record = this.serviceRequests.find((item) => item.id === input.serviceRequestId);
    if (record) {
      record.status = "TRIAGED";
      record.updatedAt = new Date().toISOString();
    }
  }

  async escalateEmergencyService(input: EmergencyServiceEscalationInput): Promise<void> {
    const record = this.serviceRequests.find((item) => item.id === input.serviceRequestId);
    if (record) {
      record.status = "ESCALATED";
      record.updatedAt = new Date().toISOString();
    }
  }

  async createServiceWorkOrder(input: CreateServiceWorkOrderInput): Promise<ServiceWorkOrderRecord> {
    const now = new Date().toISOString();
    const workOrder: ServiceWorkOrderRecord = {
      id: id("wo"),
      serviceRequestId: input.serviceRequestId,
      status: "CREATED",
      priority: input.priority,
      summary: input.summary,
      createdAt: now,
      updatedAt: now
    };

    this.workOrders.push(workOrder);
    return workOrder;
  }

  async scheduleServiceVisit(input: ScheduleServiceVisitInput): Promise<void> {
    const workOrder = this.workOrders.find((item) => item.id === input.workOrderId);
    if (workOrder) {
      workOrder.status = "SCHEDULED";
      workOrder.scheduledStart = input.scheduledStart;
      workOrder.scheduledEnd = input.scheduledEnd;
      workOrder.updatedAt = new Date().toISOString();
    }
  }

  async assignServiceTechnician(input: AssignServiceTechnicianInput): Promise<void> {
    const workOrder = this.workOrders.find((item) => item.id === input.workOrderId);
    if (workOrder) {
      workOrder.status = "ASSIGNED";
      workOrder.technicianId = input.technicianId;
      workOrder.updatedAt = new Date().toISOString();
    }
  }

  async completeServiceVisit(input: CompleteServiceVisitInput): Promise<void> {
    const workOrder = this.workOrders.find((item) => item.id === input.workOrderId);
    if (workOrder) {
      workOrder.status = "COMPLETED";
      workOrder.updatedAt = new Date().toISOString();
    }
  }

  async listServiceRequests(): Promise<PersistedServiceRequestRecord[]> {
    return [...this.serviceRequests];
  }

  async listWorkOrders(): Promise<ServiceWorkOrderRecord[]> {
    return [...this.workOrders];
  }

  async lookupTreatmentSystems(input: { systemId?: string; serialNumber?: string; customerEmail?: string }): Promise<TreatmentSystemDTO[]> {
    return this.treatmentSystems.filter((system) => {
      if (input.systemId && system.id === input.systemId) return true;
      if (input.serialNumber && system.serialNumber === input.serialNumber) return true;
      if (input.customerEmail && system.customerId === input.customerEmail) return true;
      return false;
    });
  }

  async listTechnicians(): Promise<import("./repository-contracts").TechnicianRecord[]> {
    return [...this.technicians];
  }

  async createServiceAttachmentUpload(
    input: import("./repository-contracts").CreateServiceAttachmentUploadInput
  ): Promise<import("./repository-contracts").ServiceAttachmentUploadTarget> {
    const now = new Date().toISOString();
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectPath = `dev/${input.serviceRequestId ?? input.workOrderId ?? "unassigned"}/${Date.now()}-${safeFileName}`;
    const attachment: import("./repository-contracts").ServiceAttachmentRecord = {
      id: id("attach"),
      serviceRequestId: input.serviceRequestId,
      workOrderId: input.workOrderId,
      bucket: "service-attachments",
      objectPath,
      fileName: safeFileName,
      contentType: input.contentType,
      sizeBytes: input.sizeBytes,
      uploadedBy: input.uploadedBy,
      createdAt: now
    };

    this.attachments.push(attachment);

    return {
      attachment,
      uploadUrl: `/api/service-upload-placeholder/${objectPath}`,
      expiresInSeconds: 7200
    };
  }

  async listServiceAttachments(input: { serviceRequestId?: string; workOrderId?: string }): Promise<import("./repository-contracts").ServiceAttachmentRecord[]> {
    return this.attachments.filter((attachment) => {
      if (input.serviceRequestId && attachment.serviceRequestId === input.serviceRequestId) return true;
      if (input.workOrderId && attachment.workOrderId === input.workOrderId) return true;
      return false;
    });
  }

}

export function createInMemoryServiceRepository(seed?: { treatmentSystems?: TreatmentSystemDTO[] }): InMemoryServiceRepository {
  return new InMemoryServiceRepository(seed);
}
