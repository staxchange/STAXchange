import type {
  CustomerInvoiceSummaryDTO,
  CustomerNotificationPreferenceDTO,
  CustomerProfileDTO,
  CustomerServiceHistoryItemDTO,
  CustomerSystemLinkDTO
} from "./types";

interface SupabaseLikeClient {
  from(table: string): {
    select(columns?: string): {
      eq(column: string, value: unknown): {
        maybeSingle?(): Promise<{ data: unknown; error: { message: string } | null }>;
        order?(column: string, options?: { ascending?: boolean }): Promise<{ data: unknown[] | null; error: { message: string } | null }>;
      };
    };
    insert(value: unknown): {
      select(columns?: string): {
        single(): Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
    update(value: unknown): {
      eq(column: string, value: unknown): {
        select(columns?: string): {
          single(): Promise<{ data: unknown; error: { message: string } | null }>;
        };
      };
    };
  };
}

function assertOk(error: { message?: string } | null | undefined, action: string): void {
  if (error) throw new Error(`${action}: ${error.message ?? "Supabase error"}`);
}

export class SupabaseCustomerPortalRepository {
  constructor(private readonly supabase: SupabaseLikeClient) {}

  async getCustomerProfileByUserId(authUserId: string): Promise<CustomerProfileDTO | undefined> {
    const query = this.supabase.from("customer_profiles").select("*").eq("auth_user_id", authUserId);
    const result = query.maybeSingle
      ? await query.maybeSingle()
      : ({ data: undefined, error: null } as { data: unknown; error: null });
    assertOk(result.error, "getCustomerProfileByUserId");
    if (!result.data) return undefined;
    const row = result.data as Record<string, unknown>;
    return {
      id: String(row.id),
      email: String(row.email),
      name: row.name ? String(row.name) : undefined,
      company: row.company ? String(row.company) : undefined,
      createdAt: String(row.created_at ?? new Date().toISOString())
    };
  }

  async listCustomerSystemLinks(customerId: string): Promise<CustomerSystemLinkDTO[]> {
    const result = await this.supabase
      .from("customer_system_links")
      .select("*")
      .eq("customer_id", customerId)
      .order?.("created_at", { ascending: false });
    assertOk(result?.error, "listCustomerSystemLinks");
    return ((result?.data ?? []) as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      customerId: String(row.customer_id),
      treatmentSystemId: String(row.treatment_system_id),
      accessLevel: row.access_level === "SERVICE_REQUEST" ? "SERVICE_REQUEST" : "VIEW_ONLY",
      verified: Boolean(row.verified),
      createdAt: String(row.created_at ?? new Date().toISOString())
    }));
  }

  async updateNotificationPreferences(
    preferences: CustomerNotificationPreferenceDTO
  ): Promise<CustomerNotificationPreferenceDTO> {
    const { data, error } = await this.supabase
      .from("customer_notification_preferences")
      .update({
        email_enabled: preferences.emailEnabled,
        service_updates_enabled: preferences.serviceUpdatesEnabled,
        maintenance_reminders_enabled: preferences.maintenanceRemindersEnabled,
        billing_updates_enabled: preferences.billingUpdatesEnabled,
        updated_at: new Date().toISOString()
      })
      .eq("customer_id", preferences.customerId)
      .select("*")
      .single();
    assertOk(error, "updateNotificationPreferences");
    void data;
    return preferences;
  }

  async listVisibleServiceHistory(customerId: string): Promise<CustomerServiceHistoryItemDTO[]> {
    void customerId;
    return [];
  }

  async listVisibleInvoices(customerId: string): Promise<CustomerInvoiceSummaryDTO[]> {
    void customerId;
    return [];
  }
}
