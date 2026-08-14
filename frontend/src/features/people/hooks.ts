import { useQuery } from '@tanstack/react-query';
import { peopleApi } from './api';

export function usePeopleSearch(query: string, options?: { enabled?: boolean }) {
  const trimmed = query.trim();
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ['people', 'search', trimmed],
    queryFn: () => peopleApi.search(trimmed),
    enabled,
  });
}

export function usePerson(id: string) {
  return useQuery({
    queryKey: ['people', id],
    queryFn: () => peopleApi.getById(id),
    enabled: id.length > 0,
  });
}

export function useMentors(personId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['people', personId, 'mentors'],
    queryFn: () => peopleApi.mentors(personId),
    enabled: enabled && personId.length > 0,
  });
}

export function useRelatedSkills(personId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['people', personId, 'related-skills'],
    queryFn: () => peopleApi.relatedSkills(personId),
    enabled: enabled && personId.length > 0,
  });
}
