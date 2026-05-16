import { SupabaseServiceRepository } from "@stax/service-interface";

function createInsertClient() {
  return {
    from() {
      return {
        insert() {
          return { select() { return { async single() { return { data: { id: "svc-1", brand_id: "dwg", treatment_system_id: null, customer_name: "Test", customer_email: "test@example.com", customer_phone: null, company: null, site_address: null, issue_description: "Leak", category: "LEAK", severity: "HIGH", status: "NEW", emergency_escalation: false, preferred_service_window: null, site_access_notes: null, triage_reason: "review", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, error: null }; } }; } };
        },
        update() { return { eq() { return { error: null }; } }; },
        select() { return { order() { return { data: [], error: null }; }, eq() { return { data: [], error: null }; } }; }
      };
    }
  };
}

test("creates service request through Supabase repository adapter", async () => {
  const repo = new SupabaseServiceRepository(createInsertClient() as never);
  const result = await repo.createServiceRequest({ brandId: "dwg", customer: { name: "Test", email: "test@example.com" }, issueDescription: "Leak", classification: { severity: "HIGH", category: "LEAK", requiresHumanReview: true, emergencyEscalation: false, reason: "review" } });
  expect(result.id).toBe("svc-1");
});
