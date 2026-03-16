export function getCardDisplayName(card) {
  return card?.name || "Unknown Card";
}

export function getCardValue(card) {
  return card?.value || 0;
}
