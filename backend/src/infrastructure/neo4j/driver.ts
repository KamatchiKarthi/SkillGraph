import neo4j, { Driver } from 'neo4j-driver';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

let driver: Driver | null = null;

export function getDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      env.NEO4J_URI,
      neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
    );
    logger.info('Neo4j driver created');
  }
  return driver;
}

export async function connectGraph(): Promise<void> {
  await getDriver().verifyConnectivity();
  logger.info('CognoDB connected');
}

export async function verifyConnectivity(): Promise<boolean> {
  try {
    await getDriver().verifyConnectivity();
    return true;
  } catch (error) {
    logger.error('Neo4j connectivity failed', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
    logger.info('Neo4j driver closed');
  }
}

export async function withSession<T>(
  work: (session: ReturnType<Driver['session']>) => Promise<T>,
): Promise<T> {
  const session = getDriver().session();
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}
