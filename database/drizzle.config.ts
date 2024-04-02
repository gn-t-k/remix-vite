import type { Config } from "drizzle-kit";

export default {
  schema: "./database/tables/*",
  out: "./database/migrations",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.toml",
    dbName: "my_remix_app_2",
  },
} satisfies Config;
