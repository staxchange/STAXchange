export function stripeSecretKeyConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export function stripeWebhookSecretConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.STRIPE_WEBHOOK_SECRET);
}

export function stripeSecretsAreServerOnly(): true { return true; }

export function forbiddenPublicStripeSecrets(env: Record<string, string | undefined> = process.env): string[] {
  return ["NEXT_PUBLIC_STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET"].filter((key) => Boolean(env[key]));
}
