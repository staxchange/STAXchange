export function EquipmentPhotoTypePicker({ name = "photoType" }: { name?: string }) {
  return (
    <select name={name}>
      <option value="EQUIPMENT_OVERVIEW">Equipment overview</option>
      <option value="NAMEPLATE">Nameplate</option>
      <option value="SERIAL_MODEL_TAG">Serial/model tag</option>
      <option value="CONTROL_PANEL">Control panel</option>
      <option value="PIPING_CONTEXT">Piping context</option>
      <option value="PROBLEM_AREA">Problem area</option>
      <option value="OTHER">Other</option>
    </select>
  );
}
