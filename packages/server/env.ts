import { z } from "zod";
import { DEFAULT_PORT } from "@cally/shared";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  APPLE_USERNAME: z.email(),
  APPLE_APP_PASSWORD: z.string().min(1),
  CALENDAR_IDS: z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()))
    .pipe(z.array(z.string().min(1)).min(1)),
  CALENDAR_COLORS: z
    .string()
    .transform((value) => value.split(",").map((item) => item.trim()))
    .pipe(z.array(z.string().min(1)).min(1))
    .optional(),
  BIRTHDAYS_COLOR: z.string().optional(),
  COLOR_SCHEME: z.enum(["light", "dark"]).default("light"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration.");
  console.error("Update .env file:");
  console.error(result.error.issues);
  throw new Error("Invalid environment configuration. Update .env file.");
}

export const env = result.data;
