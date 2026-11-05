import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parserdUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parserdUpdatedAt).toEqual(responseBody.updated_at);

  expect(responseBody.dependencies.database.version).toBe("16.0");

  expect(responseBody.dependencies.database.max_conections).toBe(100);
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});
