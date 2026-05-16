const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const targets = [
  {
    path: "/api/service-system-lookup",
    body: { systemId: "placeholder-system" },
    allowed: [200]
  },
  {
    path: "/api/service-request",
    body: {
      customer: { name: "Smoke Test", email: "smoke@example.com" },
      issueDescription: "Smoke test service request payload."
    },
    allowed: [200, 400]
  }
];

const failures = [];

for (const target of targets) {
  const response = await fetch(`${baseUrl}${target.path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(target.body)
  }).catch((error) => ({ status: 0, error }));

  if (!target.allowed.includes(response.status)) {
    failures.push(`${target.path} returned ${response.status}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("API smoke tests passed.");
