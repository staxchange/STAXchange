import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "packages/ai-support/src/index.ts",
  "packages/ai-support/src/request-sanitizer.ts",
  "packages/workflows/src/definitions/tech-support.ts",
  "packages/commands/src/support/CreateSupportConversationCommand.ts",
  "packages/commands/src/support/SendSupportMessageCommand.ts",
  "packages/commands/src/support/CreateSupportTicketCommand.ts",
  "packages/commands/src/support/AssignSupportTicketCommand.ts",
  "packages/commands/src/support/CloseSupportTicketCommand.ts",
  "apps/storefront/app/support/page.tsx",
  "apps/storefront/app/support/SupportChat.tsx",
  "apps/storefront/app/api/support-chat/route.ts",
  "apps/admin/app/support/page.tsx",
  "docs/workflows/TECH_SUPPORT_HUMAN_HANDOFF.md",
  "tests/support/request-sanitizer.test.ts"
];

const missing = required.filter((rel) => !fs.existsSync(path.join(root, rel)));
if (missing.length) {
  console.error("Missing support workflow files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const route = fs.readFileSync(path.join(root, "apps/storefront/app/api/support-chat/route.ts"), "utf8");
const sanitizer = fs.readFileSync(path.join(root, "packages/ai-support/src/request-sanitizer.ts"), "utf8");

const requiredRouteTokens = [
  "sanitizeSupportChatRequest(rawBody)",
  "evaluateSupportHandoff(body.messages)",
  "if (handoff.required)",
  "generateSupportReply"
];

const missingRouteTokens = requiredRouteTokens.filter((token) => !route.includes(token));
if (missingRouteTokens.length) {
  console.error("Support route is missing hardening tokens:");
  console.error(missingRouteTokens.join("\n"));
  process.exit(1);
}

const escalationIndex = route.indexOf("evaluateSupportHandoff(body.messages)");
const modelCallIndex = route.indexOf("await generateSupportReply");
if (escalationIndex === -1 || modelCallIndex === -1 || escalationIndex > modelCallIndex) {
  console.error("Escalation must be evaluated before OpenAI is called.");
  process.exit(1);
}

const bannedRouteTokens = ["@supabase/supabase-js", "stripe", "brandId: body", "siteName: body"];
const routeViolations = bannedRouteTokens.filter((token) => route.includes(token));
if (routeViolations.length) {
  console.error("Support route contains banned tokens:");
  console.error(routeViolations.join("\n"));
  process.exit(1);
}

const requiredSanitizerTokens = [
  "maxMessages: 12",
  "maxMessageCharacters: 2_000",
  "maxTotalCharacters: 10_000",
  "brandId: \"dwg\"",
  "siteName: \"DWG Process Supply\""
];

const missingSanitizerTokens = requiredSanitizerTokens.filter((token) => !sanitizer.includes(token));
if (missingSanitizerTokens.length) {
  console.error("Support sanitizer is missing required limits or locked brand context:");
  console.error(missingSanitizerTokens.join("\n"));
  process.exit(1);
}

console.log("AI support workflow hardening audit passed.");
