import { httpGet } from '../../shared/http-client';
import type {
  MentorQueryResult,
  Person,
  PersonProfile,
  RelatedSkillQueryResult,
} from '../../shared/types/graph';

export const peopleApi = {
  search: (query: string) => httpGet<Person[]>('/api/people', { q: query }),
  getById: (id: string) => httpGet<PersonProfile>(`/api/people/${id}`),
  mentors: (id: string) =>
    httpGet<MentorQueryResult>(`/api/people/${id}/mentors`),
  relatedSkills: (id: string) =>
    httpGet<RelatedSkillQueryResult>(`/api/people/${id}/related-skills`),
};
