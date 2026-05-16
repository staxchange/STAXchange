import type { SupabaseClient } from "@supabase/supabase-js";
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

type ServiceRequestRow = {
  id: string;
  brand_id: "dwg";
  treatment_system_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company: string | null;
  site_address: string | null;
  issue_description: string;
  category: string;
  severity: string;
  status: PersistedServiceRequestRecord["status"];
  emergency_escalation: boolean;
  preferred_service_window: string | null;
  site_access_notes: string | null;
  triage_reason: string | null;
  created_at: string;
  updated_at: string;
};

type ServiceWorkOrderRow = {
  id: string;
  service_request_id: string;
  status: ServiceWorkOrderRecord["status"];
  priority: string;
  summary: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  technician_id: string | null;
  created_at: string;
  updated_at: string;
};

type TreatmentSystemRow = {
  id: string;
  brand_id: "dwg";
  customer_id: string | null;
  customer_email: string | null;
  site_name: string | null;
  site_address: string | null;
  system_type: TreatmentSystemDTO["systemType"];
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  installed_at: string | null;
  last_serviced_at: string | null;
  next_service_due_at: string | null;
};

function assertOk(error: { message?: string } | null | undefined, action: string): void {
  if (error) throw new Error(`${action}: ${error.message ?? "Supabase error"}`);
}

function mapServiceRequest(row: ServiceRequestRow): PersistedServiceRequestRecord {
  return {
    id: row.id,
    brandId: row.brand_id,
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone ?? undefined,
      company: row.company ?? undefined,
      siteAddress: row.site_address ?? undefined
    },
    systemId: row.treatment_system_id ?? undefined,
    systemType: undefined,
    issueDescription: row.issue_description,
    classification: {
      severity: row.severity as never,
      category: row.category as never,
      requiresHumanReview: true,
      emergencyEscalation: row.emergency_escalation,
      reason: row.triage_reason ?? "Persisted service request."
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapWorkOrder(row: ServiceWorkOrderRow): ServiceWorkOrderRecord {
  return {
    id: row.id,
    serviceRequestId: row.service_request_id,
    status: row.status,
    priority: row.priority,
    summary: row.summary,
    technicianId: row.technician_id ?? undefined,
    scheduledStart: row.scheduled_start ?? undefined,
    scheduledEnd: row.scheduled_end ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapTreatmentSystem(row: TreatmentSystemRow): TreatmentSystemDTO {
  return {
    id: row.id,
    brandId: row.brand_id,
    customerId: row.customer_email ?? row.customer_id ?? undefined,
    siteName: row.site_name ?? undefined,
    siteAddress: row.site_address ?? undefined,
    systemType: row.system_type,
    manufacturer: row.manufacturer ?? undefined,
    model: row.model ?? undefined,
    serialNumber: row.serial_number ?? undefined,
    installedAt: row.installed_at ?? undefined,
    lastServicedAt: row.last_serviced_at ?? undefined,
    nextServiceDueAt: row.next_service_due_at ?? undefined
  };
}

export class SupabaseServiceRepository implements ServiceRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async createServiceRequest(input: PersistServiceRequestInput): Promise<PersistedServiceRequestRecord> {
    const { data, error } = await this.supabase
      .from("service_requests")
      .insert({
        brand_id: input.brandId,
        treatment_system_id: input.systemId ?? null,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone ?? null,
        company: input.customer.company ?? null,
        site_address: input.customer.siteAddress ?? null,
        issue_description: input.issueDescription,
        category: input.classification.category,
        severity: input.classification.severity,
        status: "NEW",
        emergency_escalation: input.classification.emergencyEscalation,
        preferred_service_window: input.preferredServiceWindow ?? null,
        site_access_notes: input.siteAccessNotes ?? null,
        triage_reason: input.classification.reason
      })
      .select("*")
      .single();

    assertOk(error, "createServiceRequest");
    return mapServiceRequest(data as ServiceRequestRow);
  }

  async triageServiceRequest(input: TriageServiceRequestInput): Promise<void> {
    const { error } = await this.supabase
      .from("service_requests")
      .update({
        status: "TRIAGED",
        severity: input.severity,
        category: input.category,
        triage_reason: input.reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", input.serviceRequestId);

    assertOk(error, "triageServiceRequest");
  }

  async escalateEmergencyService(input: EmergencyServiceEscalationInput): Promise<void> {
    const { error } = await this.supabase
      .from("service_requests")
      .update({
        status: "ESCALATED",
        emergency_escalation: true,
        triage_reason: input.reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", input.serviceRequestId);

    assertOk(error, "escalateEmergencyService");
  }

  async createServiceWorkOrder(input: CreateServiceWorkOrderInput): Promise<ServiceWorkOrderRecord> {
    const { data, error } = await this.supabase
      .from("service_work_orders")
      .insert({
        service_request_id: input.serviceRequestId,
        status: "CREATED",
        priority: input.priority,
        summary: input.summary
      })
      .select("*")
      .single();

    assertOk(error, "createServiceWorkOrder");
    return mapWorkOrder(data as ServiceWorkOrderRow);
  }

  async scheduleServiceVisit(input: ScheduleServiceVisitInput): Promise<void> {
    const { error } = await this.supabase
      .from("service_work_orders")
      .update({
        status: "SCHEDULED",
        scheduled_start: input.scheduledStart,
        scheduled_end: input.scheduledEnd ?? null,
        updated_at: new Date().toISOString()
      })
      .eq("id", input.workOrderId);

    assertOk(error, "scheduleServiceVisit");
  }

  async assignServiceTechnician(input: AssignServiceTechnicianInput): Promise<void> {
    const { error: updateError } = await this.supabase
      .from("service_work_orders")
      .update({
        status: "ASSIGNED",
        technician_id: input.technicianId,
        updated_at: new Date().toISOString()
      })
      .eq("id", input.workOrderId);

    assertOk(updateError, "assignServiceTechnician.updateWorkOrder");

    const { error: assignmentError } = await this.supabase
      .from("technician_assignments")
      .insert({
        work_order_id: input.workOrderId,
        technician_id: input.technicianId
      });

    assertOk(assignmentError, "assignServiceTechnician.insertAssignment");
  }

  async completeServiceVisit(input: CompleteServiceVisitInput): Promise<void> {
    const { error: visitError } = await this.supabase
      .from("service_visits")
      .insert({
        work_order_id: input.workOrderId,
        technician_id: input.technicianId,
        completed_at: new Date().toISOString(),
        findings: input.findings,
        actions_taken: input.actionsTaken,
        follow_up_required: Boolean(input.followUpRequired)
      });

    assertOk(visitError, "completeServiceVisit.insertVisit");

    const { error: workOrderError } = await this.supabase
      .from("service_work_orders")
      .update({
        status: "COMPLETED",
        updated_at: new Date().toISOString()
      })
      .eq("id", input.workOrderId);

    assertOk(workOrderError, "completeServiceVisit.updateWorkOrder");
  }

  async listServiceRequests(): Promise<PersistedServiceRequestRecord[]> {
    const { data, error } = await this.supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    assertOk(error, "listServiceRequests");
    return (data as ServiceRequestRow[]).map(mapServiceRequest);
  }

  async listWorkOrders(): Promise<ServiceWorkOrderRecord[]> {
    const { data, error } = await this.supabase
      .from("service_work_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    assertOk(error, "listWorkOrders");
    return (data as ServiceWorkOrderRow[]).map(mapWorkOrder);
  }

  async lookupTreatmentSystems(input: { systemId?: string; serialNumber?: string; customerEmail?: string }): Promise<TreatmentSystemDTO[]> {
    let query = this.supabase.from("treatment_systems").select("*").limit(20);

    if (input.systemId) query = query.eq("id", input.systemId);
    else if (input.serialNumber) query = query.eq("serial_number", input.serialNumber);
    else if (input.customerEmail) query = query.eq("customer_email", input.customerEmail.toLowerCase());
    else return [];

    const { data, error } = await query;

    assertOk(error, "lookupTreatmentSystems");
    return (data as TreatmentSystemRow[]).map(mapTreatmentSystem);
  }

  async listTechnicians(): Promise<import("./repository-contracts").TechnicianRecord[]> {
    const { data, error } = await this.supabase
      .from("technicians")
      .select("id,user_id,display_name,email,active,territories,skills,created_at,updated_at")
      .eq("active", true)
      .order("display_name", { ascending: true });

    assertOk(error, "listTechnicians");

    return ((data ?? []) as Array<{
      id: string;
      user_id: string;
      display_name: string;
      email: string;
      active: boolean;
      territories: string[] | null;
      skills: string[] | null;
      created_at: string;
      updated_at: string;
    }>).map((row) => ({
      id: row.id,
      userId: row.user_id,
      displayName: row.display_name,
      email: row.email,
      active: row.active,
      territories: row.territories ?? [],
      skills: row.skills ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

}

export function createSupabaseServiceRepository(supabase: SupabaseClient): SupabaseServiceRepository {
  return new SupabaseServiceRepository(supabase);
}
