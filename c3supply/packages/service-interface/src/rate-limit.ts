export interface RateLimitResult {
  allowed: boolean;
  key: string;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

export interface RateLimitOptions {
  max: number;
  windowMs: number;
  now?: number;
}

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  check(key: string): RateLimitDecision;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly instanceBuckets = new Map<string, Bucket>();

  constructor(private readonly options: { max: number; windowMs: number }) {}

  check(key: string): RateLimitDecision {
    const now = Date.now();
    const existing = this.instanceBuckets.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + this.options.windowMs;
      this.instanceBuckets.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: Math.max(0, this.options.max - 1),
        resetAt
      };
    }

    if (existing.count >= this.options.max) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: existing.resetAt,
        retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000)
      };
    }

    existing.count += 1;

    return {
      allowed: true,
      remaining: Math.max(0, this.options.max - existing.count),
      resetAt: existing.resetAt
    };
  }
}

export function getClientRateLimitKey(request: Request, prefix = "service"): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

export function checkInMemoryRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = options.now ?? Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs
    });

    return {
      allowed: true,
      key,
      remaining: Math.max(options.max - 1, 0),
      resetAt: now + options.windowMs
    };
  }

  existing.count += 1;

  return {
    allowed: existing.count <= options.max,
    key,
    remaining: Math.max(options.max - existing.count, 0),
    resetAt: existing.resetAt,
    retryAfterSeconds: existing.count > options.max ? Math.ceil((existing.resetAt - now) / 1000) : undefined
  };
}

export function createServiceRateLimiter(env: NodeJS.ProcessEnv = process.env): InMemoryRateLimiter {
  return new InMemoryRateLimiter({
    max: Number(env.SERVICE_RATE_LIMIT_MAX ?? 10),
    windowMs: Number(env.SERVICE_RATE_LIMIT_WINDOW_MS ?? 60_000)
  });
}

export function resetInMemoryRateLimitForTests(): void {
  buckets.clear();
}
