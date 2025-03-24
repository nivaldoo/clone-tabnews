import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, respose) {
  const dbClient = await database.getNewClient();
  const defaultMigratoinOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigratoinOptions);
    await dbClient.end();
    return respose.status(200).json(pendingMigrations);
  }
  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigratoinOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return respose.status(201).json(migratedMigrations);
    }
    return respose.status(200).json(migratedMigrations);
  }

  return respose.status(405).end();
}
