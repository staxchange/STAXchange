import { permissionMatrix } from "@stax/governance";

test("technician can perform assigned work order field actions", () => {
  expect(permissionMatrix.TECHNICIAN).toContain("technician.work_orders.list");
  expect(permissionMatrix.TECHNICIAN).toContain("technician.checklist.complete");
  expect(permissionMatrix.TECHNICIAN).toContain("technician.closeout.submit");
});

test("technician cannot approve manager closeout", () => {
  expect(permissionMatrix.TECHNICIAN).not.toContain("manager.closeout.approve");
});

test("service manager can approve or reject closeout", () => {
  expect(permissionMatrix.SERVICE_MANAGER).toContain("manager.closeout.approve");
  expect(permissionMatrix.SERVICE_MANAGER).toContain("manager.closeout.reject");
});
