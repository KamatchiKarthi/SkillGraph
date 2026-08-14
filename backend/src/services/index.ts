import { graphRepository } from '../infrastructure/neo4j/repositories/graph.repository.js';
import { AppError } from '../domain/errors.js';
import type {
  GraphStats,
  MentorQueryResult,
  PathQueryResult,
  Person,
  PersonProfile,
  RelatedSkillQueryResult,
} from '../domain/entities.js';
import { verifyConnectivity } from '../infrastructure/neo4j/driver.js';
import {
  MENTOR_QUERY,
  PATH_QUERY,
  RELATED_SKILL_QUERY,
} from '../infrastructure/neo4j/cypher/meta.js';

export class PeopleService {
  async search(query: string, limit = 20): Promise<Person[]> {
    return graphRepository.searchPeople(query.trim(), limit);
  }

  async getById(id: string): Promise<PersonProfile> {
    const profile = await graphRepository.getPersonProfile(id);
    if (!profile) {
      throw AppError.notFound(`Person not found: ${id}`);
    }
    return profile;
  }

  async findMentors(id: string, limit = 12): Promise<MentorQueryResult> {
    await this.getById(id);
    const matches = await graphRepository.findMentors(id, limit);
    return {
      matches,
      query: MENTOR_QUERY,
    };
  }

  async relatedSkills(id: string, limit = 12): Promise<RelatedSkillQueryResult> {
    await this.getById(id);
    const skills = await graphRepository.personRelatedSkills(id, limit);
    return {
      skills,
      query: RELATED_SKILL_QUERY,
    };
  }
}

export class PathService {
  async shortest(fromId: string, toId: string): Promise<PathQueryResult> {
    if (fromId === toId) {
      throw AppError.validation('from and to must be different people');
    }
    const path = await graphRepository.shortestPath(fromId, toId);
    if (!path) {
      throw AppError.notFound('No path found between the selected people');
    }
    return {
      path,
      query: PATH_QUERY,
    };
  }
}

export class SkillService {
  async related(skillId: string, limit = 10): Promise<RelatedSkillQueryResult> {
    const skills = await graphRepository.relatedSkills(skillId, limit);
    return {
      skills,
      query: RELATED_SKILL_QUERY,
    };
  }
}

export class HealthService {
  async check(): Promise<{
    status: 'ok' | 'degraded';
    app: 'up';
    cognodb: 'up' | 'down';
  }> {
    const connected = await verifyConnectivity();
    const cognodbOk = connected && (await graphRepository.healthCheck());
    return {
      status: cognodbOk ? 'ok' : 'degraded',
      app: 'up',
      cognodb: cognodbOk ? 'up' : 'down',
    };
  }

  async stats(): Promise<GraphStats> {
    return graphRepository.graphStats();
  }
}

export const peopleService = new PeopleService();
export const pathService = new PathService();
export const skillService = new SkillService();
export const healthService = new HealthService();
