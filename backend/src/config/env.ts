import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
loadEnv({ path: resolve(rootDir, '.env') });
loadEnv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  NEO4J_URI: z.string().min(1, 'NEO4J_URI is required'),
  NEO4J_USER: z.string().min(1).default('neo4j'),
  NEO4J_PASSWORD: z.string().min(1, 'NEO4J_PASSWORD is required'),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment: ${details}`);
  }
  return parsed.data;
}

export const env: Env = parseEnv();
