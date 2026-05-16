import { InMemoryRateLimiter } from "@stax/service-interface";

test("rate limiter blocks after configured max", () => {
  const limiter = new InMemoryRateLimiter({ max: 2, windowMs: 1000 });

  expect(limiter.check("client").allowed).toBe(true);
  expect(limiter.check("client").allowed).toBe(true);
  expect(limiter.check("client").allowed).toBe(false);
});
