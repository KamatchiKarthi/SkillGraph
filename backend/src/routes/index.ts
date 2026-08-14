import { Router } from 'express';
import {
  getGraphStats,
  getHealth,
  getMentors,
  getPath,
  getPerson,
  getPersonRelatedSkills,
  getRelatedSkills,
  searchPeople,
} from '../controllers/index.js';
import { validate } from '../middleware/validate.js';
import {
  mentorsQuerySchema,
  pathQuerySchema,
  personIdSchema,
  relatedSkillsQuerySchema,
  searchPeopleSchema,
  skillIdSchema,
} from '../middleware/schemas.js';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'CognoDB Skill Graph API',
      endpoints: [
        'GET /api/health',
        'GET /api/graph/stats',
        'GET /api/people?q=',
        'GET /api/people/:id',
        'GET /api/people/:id/mentors',
        'GET /api/people/:id/related-skills',
        'GET /api/paths?from=&to=',
        'GET /api/skills/:id/related',
      ],
    },
  });
});

apiRouter.get('/health', getHealth);
apiRouter.get('/graph/stats', getGraphStats);

apiRouter.get(
  '/people',
  validate(searchPeopleSchema, 'query'),
  searchPeople,
);

apiRouter.get(
  '/people/:id',
  validate(personIdSchema, 'params'),
  getPerson,
);

apiRouter.get(
  '/people/:id/mentors',
  validate(personIdSchema, 'params'),
  validate(mentorsQuerySchema, 'query', 'validatedQuery'),
  getMentors,
);

apiRouter.get(
  '/people/:id/related-skills',
  validate(personIdSchema, 'params'),
  validate(relatedSkillsQuerySchema, 'query', 'validatedQuery'),
  getPersonRelatedSkills,
);

apiRouter.get(
  '/paths',
  validate(pathQuerySchema, 'query'),
  getPath,
);

apiRouter.get(
  '/skills/:id/related',
  validate(skillIdSchema, 'params'),
  validate(relatedSkillsQuerySchema, 'query', 'validatedQuery'),
  getRelatedSkills,
);
