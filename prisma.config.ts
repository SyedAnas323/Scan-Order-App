import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });

function normalizeConnectionString(value?: string) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

const prismaDatasourceUrl =
  normalizeConnectionString(process.env.DIRECT_URL) ||
  normalizeConnectionString(process.env.DATABASE_URL);

export default defineConfig({
  datasource: {
    url: prismaDatasourceUrl
  }
});
