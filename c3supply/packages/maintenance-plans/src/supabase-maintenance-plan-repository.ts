import type { MaintenancePlanDTO, MaintenancePlanEventDTO } from "./types";

interface SupabaseLikeClient {
  from(table: string): {
    insert(value: unknown): { select(columns?: string): { single(): Promise<{ data: unknown; error: { message: string } | null }> } };
    update(value: unknown): { eq(column: string, value: unknown): { select(columns?: string): { single(): Promise<{ data: unknown; error: { message: string } | null }> } } };
  };
}

function assertOk(error: { message?: string } | null | undefined, action: string): void {
  if (error) throw new Error(`${action}: ${error.message ?? "Supabase error"}`);
}

export class SupabaseMaintenancePlanRepository {
  constructor(private readonly supabase: SupabaseLikeClient) {}

  async createPlan(plan: MaintenancePlanDTO): Promise<MaintenancePlanDTO> {
    const { data, error } = await this.supabase
      .from("maintenance_plans")
      .insert({
        id: plan.id,
        customer_id: plan.customerId,
        treatment_system_id: plan.treatmentSystemId ?? null,
        status: plan.status,
        frequency: plan.frequency,
        next_visit_due_at: plan.nextVisitDueAt ?? null
      })
      .select("*")
      .single();
    assertOk(error, "createPlan");
    void data;
    return plan;
  }

  async updatePlanStatus(planId: string, status: MaintenancePlanDTO["status"]): Promise<void> {
    const { error } = await this.supabase
      .from("maintenance_plans")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", planId)
      .select("*")
      .single();
    assertOk(error, "updatePlanStatus");
  }

  async appendPlanEvent(event: MaintenancePlanEventDTO): Promise<MaintenancePlanEventDTO> {
    const { data, error } = await this.supabase
      .from("maintenance_plan_events")
      .insert({
        id: event.id,
        maintenance_plan_id: event.maintenancePlanId,
        event_type: event.eventType,
        created_at: event.createdAt
      })
      .select("*")
      .single();
    assertOk(error, "appendPlanEvent");
    void data;
    return event;
  }
}
