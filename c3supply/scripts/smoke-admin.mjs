const baseUrl = process.env.SMOKE_ADMIN_BASE_URL ?? process.env.SMOKE_BASE_URL ?? "http://localhost:3001";
const paths = ["/api/health"];
const failures = [];

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`).catch((error) => ({ ok: false, status: 0, error }));
  if (!response.ok) failures.push(`${path} returned ${response.status}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Admin smoke tests passed.");
