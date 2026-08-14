import type {
  Company,
  MentorMatch,
  MentorWhyTrail,
  PathHop,
  Person,
  PersonProfile,
  RelatedSkill,
  Role,
  Skill,
} from '../../domain/entities.js';

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
}

export function mapPerson(props: Record<string, unknown>): Person {
  return {
    id: asString(props.id),
    name: asString(props.name),
    title: asString(props.title),
    bio: asString(props.bio),
  };
}

export function mapSkill(props: Record<string, unknown>): Skill {
  return {
    id: asString(props.id),
    name: asString(props.name),
    category: asString(props.category),
  };
}

export function mapCompany(props: Record<string, unknown> | null): Company | null {
  if (!props) {
    return null;
  }
  return {
    id: asString(props.id),
    name: asString(props.name),
    industry: asString(props.industry),
  };
}

export function mapRole(props: Record<string, unknown>): Role {
  return {
    id: asString(props.id),
    name: asString(props.name),
    level: asString(props.level),
  };
}

export function mapPersonProfile(record: {
  person: Record<string, unknown>;
  skills: Array<Record<string, unknown>>;
  company: Record<string, unknown> | null;
  roles: Array<Record<string, unknown>>;
}): PersonProfile {
  return {
    ...mapPerson(record.person),
    skills: (record.skills ?? []).map(mapSkill),
    company: mapCompany(record.company),
    roles: (record.roles ?? []).map(mapRole),
  };
}

function buildWhyTrails(
  seeker: Person,
  mentor: Person,
  sharedSkills: Skill[],
): MentorWhyTrail[] {
  return sharedSkills.map((skill) => ({
    skill,
    hops: [
      {
        type: 'Person',
        id: seeker.id,
        name: seeker.name,
        relationship: null,
      },
      {
        type: 'Skill',
        id: skill.id,
        name: skill.name,
        relationship: 'HAS_SKILL',
      },
      {
        type: 'Person',
        id: mentor.id,
        name: mentor.name,
        relationship: 'HAS_SKILL',
      },
    ],
  }));
}

export function mapMentorMatch(record: {
  seeker: Record<string, unknown>;
  person: Record<string, unknown>;
  sharedSkills: Array<Record<string, unknown>>;
  hopCount: number | { toNumber: () => number };
  company: Record<string, unknown> | null;
}): MentorMatch {
  const hopCount =
    typeof record.hopCount === 'number'
      ? record.hopCount
      : record.hopCount.toNumber();
  const seeker = mapPerson(record.seeker);
  const person = mapPerson(record.person);
  const sharedSkills = (record.sharedSkills ?? []).map(mapSkill);

  return {
    person,
    sharedSkills,
    hopCount,
    company: mapCompany(record.company),
    whyTrails: buildWhyTrails(seeker, person, sharedSkills),
  };
}

export function mapPathHop(
  node: { labels: string[]; properties: Record<string, unknown> },
  relationship: string | null,
): PathHop {
  const label = (node.labels[0] ?? 'Person') as PathHop['type'];
  return {
    type: label,
    id: asString(node.properties.id),
    name: asString(node.properties.name),
    relationship,
  };
}

export function mapRelatedSkill(record: {
  skill: Record<string, unknown>;
  relationship: string;
  via: string;
}): RelatedSkill {
  return {
    skill: mapSkill(record.skill),
    relationship: asString(record.relationship, 'RELATED_TO'),
    via: asString(record.via),
  };
}

function toCount(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export function mapGraphCount(record: {
  name: string;
  total: unknown;
}): { name: string; total: number } {
  return {
    name: asString(record.name),
    total: toCount(record.total),
  };
}
