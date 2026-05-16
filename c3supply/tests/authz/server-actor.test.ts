import { actorFromHeaders, parseActorRole, placeholderActor } from "@stax/authz";

test("parses known actor role", () => {
  expect(parseActorRole("FINANCE")).toBe("FINANCE");
  expect(parseActorRole("BAD_ROLE")).toBeUndefined();
});

test("creates actor from headers", () => {
  const headers = new Headers({
    "x-stax-role": "TECHNICIAN",
    "x-stax-actor-id": "tech-1",
    "x-stax-assigned-work-orders": "wo-1,wo-2"
  });

  const actor = actorFromHeaders(headers);

  expect(actor?.role).toBe("TECHNICIAN");
  expect(actor?.assignedWorkOrderIds).toContain("wo-1");
});

test("placeholder actor works", () => {
  expect(placeholderActor("ADMIN").role).toBe("ADMIN");
});
