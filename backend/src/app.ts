import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { connectGraph } from './infrastructure/neo4j/driver.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { apiRouter } from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CognoDB Skill Graph API',
    health: '/api/health',
  });
});
app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

connectGraph().catch((error) => {
  logger.error('CognoDB init error', {
    error: error instanceof Error ? error.message : 'unknown',
  });
});

export { app };
export default app;
