import { permissionMatrix } from "@stax/governance";

test("technicians cannot approve invoices", () => {
  expect(permissionMatrix.TECHNICIAN).toContain("billing.labor.create");
  expect(permissionMatrix.TECHNICIAN).toContain("billing.parts.add");
  expect(permissionMatrix.TECHNICIAN).not.toContain("billing.invoice.approve");
});

test("finance can approve invoices and create Simply Accounting export batches", () => {
  expect(permissionMatrix.FINANCE).toContain("billing.invoice.approve");
  expect(permissionMatrix.FINANCE).toContain("billing.invoice.reject");
  expect(permissionMatrix.FINANCE).toContain("billing.sage_batch.create");
});
