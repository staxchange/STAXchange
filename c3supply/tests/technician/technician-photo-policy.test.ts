import { validateServicePhotoUpload } from "@stax/technician-portal";

test("photo upload requires workOrderId and technician actor", () => {
  expect(() => validateServicePhotoUpload({ contentType: "image/jpeg", technicianId: "tech" })).toThrow("workOrderId");
  expect(() => validateServicePhotoUpload({ contentType: "image/jpeg", workOrderId: "wo" })).toThrow("technicianId");
});

test("photo upload rejects unsupported type", () => {
  expect(() => validateServicePhotoUpload({ contentType: "application/x-msdownload", workOrderId: "wo", technicianId: "tech" })).toThrow("Unsupported");
});
