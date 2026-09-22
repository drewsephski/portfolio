import { rateLimitMax, rateLimitWindowMs } from "./limits";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function consumeChatRateLimit(key: string, now = Date.now()) {
  if (buckets.size > 500) {
    for (const [bucketKey, bucket] of buckets) {
      if (now >= bucket.resetAt) buckets.delete(bucketKey);
    }
  }

  const current = buckets.get(key);
  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= rateLimitMax) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
