export interface Person {
  id: string;
  name: string;
  title: string;
  bio: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export interface Role {
  id: string;
  name: string;
  level: string;
}

export interface PersonProfile extends Person {
  skills: Skill[];
  company: Company | null;
  roles: Role[];
}

export interface MentorWhyTrail {
  skill: Skill;
  hops: PathHop[];
}

export interface MentorMatch {
  person: Person;
  sharedSkills: Skill[];
  hopCount: number;
  company: Company | null;
  whyTrails: MentorWhyTrail[];
}

export interface PathHop {
  type: 'Person' | 'Skill' | 'Company' | 'Role';
  id: string;
  name: string;
  relationship: string | null;
}

export interface GraphPath {
  hops: PathHop[];
  length: number;
}

export interface RelatedSkill {
  skill: Skill;
  relationship: string;
  via: string;
}

export interface GraphCount {
  name: string;
  total: number;
}

export interface GraphStats {
  store: 'CognoDB';
  nodes: GraphCount[];
  relationships: GraphCount[];
}

export interface GraphQueryInfo {
  store: 'CognoDB';
  name: string;
  pattern: string;
  cypher: string;
}

export interface MentorQueryResult {
  matches: MentorMatch[];
  query: GraphQueryInfo;
}

export interface PathQueryResult {
  path: GraphPath;
  query: GraphQueryInfo;
}

export interface RelatedSkillQueryResult {
  skills: RelatedSkill[];
  query: GraphQueryInfo;
}
