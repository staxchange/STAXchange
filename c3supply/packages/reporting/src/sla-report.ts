export function slaBreached(targetHours: number, actualHours: number): boolean {
  return actualHours > targetHours;
}

export function slaLabel(targetHours: number): string {
  if (targetHours <= 1) return "Emergency";
  if (targetHours <= 4) return "Priority";
  if (targetHours <= 24) return "Standard";
  return "Routine";
}
