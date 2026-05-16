import type { ChecklistItemDTO } from "./types";

export function markChecklistItemComplete(item: ChecklistItemDTO): ChecklistItemDTO {
  return {
    ...item,
    completed: true,
    completedAt: new Date().toISOString()
  };
}

export function checklistIsComplete(items: ChecklistItemDTO[]): boolean {
  return items.length > 0 && items.every((item) => item.completed);
}
