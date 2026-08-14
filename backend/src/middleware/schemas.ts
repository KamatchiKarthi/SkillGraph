import { z } from 'zod';

export const searchPeopleSchema = z.object({
  q: z.string().default(''),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const personIdSchema = z.object({
  id: z.string().min(1),
});

export const mentorsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

export const pathQuerySchema = z.object({
  from: z.string().min(1, 'from is required'),
  to: z.string().min(1, 'to is required'),
});

export const skillIdSchema = z.object({
  id: z.string().min(1),
});

export const relatedSkillsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(30).default(10),
});
