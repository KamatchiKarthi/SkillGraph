import app from './app.js';
import { env } from './config/env.js';
import { closeDriver } from './infrastructure/neo4j/driver.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info('API listening', { port: env.PORT, env: env.NODE_ENV });
});

async function shutdown(signal: string): Promise<void> {
  logger.info('Shutting down', { signal });
  server.close(async () => {
    await closeDriver();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
