import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  BACKEND_API_URL: z.string().url(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Executive Cooperation"),
});

const isServer = typeof window === "undefined";

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_API_URL:
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    "http://localhost:8000/api",
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
};

const mergedSchema = isServer
  ? serverSchema.merge(clientSchema)
  : clientSchema;

const parsed = mergedSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

export const serverEnv = isServer
  ? (parsed.data as z.infer<typeof serverSchema> &
      z.infer<typeof clientSchema>)
  : ({} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>);
