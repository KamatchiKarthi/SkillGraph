import type { NextFunction, Request, Response } from 'express';
import {
  healthService,
  pathService,
  peopleService,
  skillService,
} from '../services/index.js';
import type {
  mentorsQuerySchema,
  pathQuerySchema,
  personIdSchema,
  relatedSkillsQuerySchema,
  searchPeopleSchema,
  skillIdSchema,
} from '../middleware/schemas.js';
import type { z } from 'zod';

type ValidatedRequest<T> = Request & { validated: T };

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await healthService.check();
    const statusCode = data.cognodb === 'up' ? 200 : 503;
    res.status(statusCode).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getGraphStats(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await healthService.stats();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function searchPeople(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { q, limit } = (req as ValidatedRequest<z.infer<typeof searchPeopleSchema>>)
      .validated;
    const data = await peopleService.search(q, limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPerson(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = (req as ValidatedRequest<z.infer<typeof personIdSchema>>).validated;
    const data = await peopleService.getById(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getMentors(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = (req as ValidatedRequest<z.infer<typeof personIdSchema>>).validated;
    const query = (req as Request & {
      validatedQuery?: z.infer<typeof mentorsQuerySchema>;
    }).validatedQuery ?? { limit: 12 };
    const data = await peopleService.findMentors(id, query.limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPersonRelatedSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = (req as ValidatedRequest<z.infer<typeof personIdSchema>>).validated;
    const query = (req as Request & {
      validatedQuery?: z.infer<typeof relatedSkillsQuerySchema>;
    }).validatedQuery ?? { limit: 12 };
    const data = await peopleService.relatedSkills(id, query.limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getPath(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { from, to } = (req as ValidatedRequest<z.infer<typeof pathQuerySchema>>)
      .validated;
    const data = await pathService.shortest(from, to);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = (req as ValidatedRequest<z.infer<typeof skillIdSchema>>).validated;
    const query = (req as Request & {
      validatedQuery?: z.infer<typeof relatedSkillsQuerySchema>;
    }).validatedQuery ?? { limit: 10 };
    const data = await skillService.related(id, query.limit);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
