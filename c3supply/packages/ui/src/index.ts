export interface BadgeProps {
  label: string;
}

export function badgeText(props: BadgeProps): string {
  return props.label.toUpperCase();
}

export const uiPackageReady = true;
