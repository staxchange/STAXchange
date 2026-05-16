import { EquipmentPhotoTypePicker } from "./EquipmentPhotoTypePicker";

export function PhotoQuoteIntakeForm() {
  return (
    <form method="post" action="/api/photo-quote/create">
      <h2>Photo quote intake</h2>
      <p>Upload overview and nameplate photos when possible. Human review required before quote.</p>
      <input name="customerName" placeholder="Customer name" required />
      <input name="customerEmail" placeholder="Customer email" />
      <input name="siteName" placeholder="Site name" required />
      <input name="operatorId" placeholder="Operator ID" required />
      <select name="priority" defaultValue="STANDARD">
        <option value="LOW">Low</option>
        <option value="STANDARD">Standard</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>
      <textarea name="notes" placeholder="Operator notes" required />
      <EquipmentPhotoTypePicker />
      <button type="submit">Create photo quote intake</button>
    </form>
  );
}
