export const SEARCH_PEOPLE = `
MATCH (p:Person)
WHERE $q = ''
   OR toLower(p.name) CONTAINS toLower($q)
   OR toLower(p.title) CONTAINS toLower($q)
RETURN p { .* } AS person
ORDER BY p.name
LIMIT $limit
`;

export const GET_PERSON_PROFILE = `
MATCH (p:Person {id: $id})
OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (p)-[:WORKS_AT]->(c:Company)
OPTIONAL MATCH (p)-[:INTERESTED_IN]->(r:Role)
RETURN p { .* } AS person,
       collect(DISTINCT s { .* }) AS skills,
       CASE WHEN c IS NULL THEN null ELSE c { .* } END AS company,
       collect(DISTINCT r { .* }) AS roles
`;

export const FIND_MENTORS = `
MATCH (seeker:Person {id: $id})
MATCH (seeker)-[:HAS_SKILL]->(shared:Skill)<-[:HAS_SKILL]-(mentor:Person)
WHERE mentor.id <> seeker.id
OPTIONAL MATCH (mentor)-[:WORKS_AT]->(c:Company)
WITH seeker, mentor, c, collect(DISTINCT shared { .* }) AS sharedSkills
RETURN seeker { .* } AS seeker,
       mentor { .* } AS person,
       sharedSkills,
       2 AS hopCount,
       CASE WHEN c IS NULL THEN null ELSE c { .* } END AS company
ORDER BY size(sharedSkills) DESC, mentor.name
LIMIT $limit
`;

export const SHORTEST_PATH = `
MATCH (from:Person {id: $from}), (to:Person {id: $to})
MATCH path = shortestPath(
  (from)-[:HAS_SKILL|WORKS_AT|INTERESTED_IN|HIRES_FOR|RELATED_TO*..6]-(to)
)
RETURN path
LIMIT 1
`;

export const RELATED_SKILLS = `
MATCH (s:Skill {id: $id})-[:RELATED_TO]-(related:Skill)
RETURN related { .* } AS skill, 'RELATED_TO' AS relationship, s.name AS via
ORDER BY related.name
LIMIT $limit
`;

export const PERSON_RELATED_SKILLS = `
MATCH (p:Person {id: $id})-[:HAS_SKILL]->(owned:Skill)-[:RELATED_TO]-(related:Skill)
WHERE NOT (p)-[:HAS_SKILL]->(related)
RETURN DISTINCT related { .* } AS skill,
       'RELATED_TO' AS relationship,
       owned.name AS via
ORDER BY related.name
LIMIT $limit
`;

export const GRAPH_NODE_STATS = `
MATCH (n)
UNWIND labels(n) AS label
RETURN label AS name, count(*) AS total
ORDER BY label
`;

export const GRAPH_REL_STATS = `
MATCH ()-[r]->()
RETURN type(r) AS name, count(*) AS total
ORDER BY name
`;

export const HEALTH_PING = `
RETURN 1 AS ok
`;

export const CONSTRAINTS = `
CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT role_id IF NOT EXISTS FOR (r:Role) REQUIRE r.id IS UNIQUE;
`;
