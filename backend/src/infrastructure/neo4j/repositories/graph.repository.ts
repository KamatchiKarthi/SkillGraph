import type {
  GraphCount,
  GraphPath,
  GraphStats,
  MentorMatch,
  Person,
  PersonProfile,
  RelatedSkill,
} from '../../../domain/entities.js';
import { AppError } from '../../../domain/errors.js';
import { withSession } from '../driver.js';
import {
  FIND_MENTORS,
  GET_PERSON_PROFILE,
  GRAPH_NODE_STATS,
  GRAPH_REL_STATS,
  HEALTH_PING,
  PERSON_RELATED_SKILLS,
  RELATED_SKILLS,
  SEARCH_PEOPLE,
  SHORTEST_PATH,
} from '../cypher/queries.js';
import {
  mapGraphCount,
  mapMentorMatch,
  mapPathHop,
  mapPerson,
  mapPersonProfile,
  mapRelatedSkill,
} from '../mappers.js';
import neo4j from 'neo4j-driver';

function toInt(value: number): neo4j.Integer {
  return neo4j.int(value);
}

export class GraphRepository {
  async healthCheck(): Promise<boolean> {
    try {
      await withSession(async (session) => {
        await session.run(HEALTH_PING);
      });
      return true;
    } catch {
      return false;
    }
  }

  async searchPeople(query: string, limit = 20): Promise<Person[]> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(SEARCH_PEOPLE, {
          q: query,
          limit: toInt(limit),
        });
        return result.records.map((record) =>
          mapPerson(record.get('person') as Record<string, unknown>),
        );
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Search failed',
      );
    }
  }

  async getPersonProfile(id: string): Promise<PersonProfile | null> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(GET_PERSON_PROFILE, { id });
        const record = result.records[0];
        if (!record) {
          return null;
        }
        return mapPersonProfile({
          person: record.get('person') as Record<string, unknown>,
          skills: record.get('skills') as Array<Record<string, unknown>>,
          company: record.get('company') as Record<string, unknown> | null,
          roles: record.get('roles') as Array<Record<string, unknown>>,
        });
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Profile lookup failed',
      );
    }
  }

  async findMentors(personId: string, limit = 12): Promise<MentorMatch[]> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(FIND_MENTORS, {
          id: personId,
          limit: toInt(limit),
        });
        return result.records.map((record) =>
          mapMentorMatch({
            seeker: record.get('seeker') as Record<string, unknown>,
            person: record.get('person') as Record<string, unknown>,
            sharedSkills: record.get('sharedSkills') as Array<Record<string, unknown>>,
            hopCount: record.get('hopCount') as number | { toNumber: () => number },
            company: record.get('company') as Record<string, unknown> | null,
          }),
        );
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Mentor discovery failed',
      );
    }
  }

  async shortestPath(fromId: string, toId: string): Promise<GraphPath | null> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(SHORTEST_PATH, {
          from: fromId,
          to: toId,
        });
        const record = result.records[0];
        if (!record) {
          return null;
        }

        const path = record.get('path') as {
          segments: Array<{
            start: { labels: string[]; properties: Record<string, unknown> };
            relationship: { type: string };
            end: { labels: string[]; properties: Record<string, unknown> };
          }>;
          start: { labels: string[]; properties: Record<string, unknown> };
          length: number | { toNumber: () => number };
        };

        const hops = [];
        hops.push(mapPathHop(path.start, null));

        for (const segment of path.segments) {
          hops.push(
            mapPathHop(segment.end, segment.relationship.type),
          );
        }

        const length =
          typeof path.length === 'number' ? path.length : path.length.toNumber();

        return { hops, length };
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Path query failed',
      );
    }
  }

  async relatedSkills(skillId: string, limit = 10): Promise<RelatedSkill[]> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(RELATED_SKILLS, {
          id: skillId,
          limit: toInt(limit),
        });
        return result.records.map((record) =>
          mapRelatedSkill({
            skill: record.get('skill') as Record<string, unknown>,
            relationship: record.get('relationship') as string,
            via: record.get('via') as string,
          }),
        );
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Related skills failed',
      );
    }
  }

  async personRelatedSkills(personId: string, limit = 12): Promise<RelatedSkill[]> {
    try {
      return await withSession(async (session) => {
        const result = await session.run(PERSON_RELATED_SKILLS, {
          id: personId,
          limit: toInt(limit),
        });
        return result.records.map((record) =>
          mapRelatedSkill({
            skill: record.get('skill') as Record<string, unknown>,
            relationship: record.get('relationship') as string,
            via: record.get('via') as string,
          }),
        );
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Related skill traversal failed',
      );
    }
  }

  async graphStats(): Promise<GraphStats> {
    try {
      return await withSession(async (session) => {
        const nodesResult = await session.run(GRAPH_NODE_STATS);
        const relsResult = await session.run(GRAPH_REL_STATS);
        const nodes: GraphCount[] = nodesResult.records.map((record) =>
          mapGraphCount({
            name: record.get('name') as string,
            total: record.get('total'),
          }),
        );
        const relationships: GraphCount[] = relsResult.records.map((record) =>
          mapGraphCount({
            name: record.get('name') as string,
            total: record.get('total'),
          }),
        );
        return {
          store: 'CognoDB',
          nodes,
          relationships,
        };
      });
    } catch (error) {
      throw AppError.dbUnavailable(
        error instanceof Error ? error.message : 'Graph stats failed',
      );
    }
  }
}

export const graphRepository = new GraphRepository();
