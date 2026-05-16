import { createMaintenanceFollowupDTO } from "@stax/service-billing";

test("creates maintenance follow-up DTO", () => {
  const followup = createMaintenanceFollowupDTO({
    id: "followup-1",
    workOrderId: "wo-1",
    reason: "Replace cartridge in 6 months."
  });

  expect(followup.status).toBe("CREATED");
  expect(followup.workOrderId).toBe("wo-1");
});
