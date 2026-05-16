import { SupabaseAuditSink } from "@stax/audit";

test("supabase audit sink validates required fields and appends", async () => {
  const inserts: unknown[] = [];
  const sink = new SupabaseAuditSink({ from() { return { insert(value: unknown) { inserts.push(value); return Promise.resolve({ error: null }); } }; } });
  await sink.append({ id: "audit-1", actorId: "actor-1", actorRole: "ADMIN", action: "Test", workflow: "test", createdAt: new Date().toISOString() });
  expect(inserts).toHaveLength(1);
});

test("supabase audit sink rejects missing actor", async () => {
  const sink = new SupabaseAuditSink({ from() { return { insert() { return Promise.resolve({ error: null }); } }; } });
  await expect(sink.append({ id: "audit-1", actorId: "", actorRole: "ADMIN", action: "Test", workflow: "test", createdAt: new Date().toISOString() })).rejects.toThrow("actorId");
});
