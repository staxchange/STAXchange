export function assertServerOnly(scope: string): void {
  if (typeof window !== "undefined") {
    throw new Error(`${scope} must only run on the server.`);
  }
}
