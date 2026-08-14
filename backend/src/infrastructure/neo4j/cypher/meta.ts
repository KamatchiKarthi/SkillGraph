export interface GraphQueryInfo {
  store: 'CognoDB';
  name: string;
  pattern: string;
  cypher: string;
}

export const MENTOR_QUERY: GraphQueryInfo = {
  store: 'CognoDB',
  name: 'findMentors',
  pattern: '(Person)-[:HAS_SKILL]->(Skill)<-[:HAS_SKILL]-(Person)',
  cypher:
    'MATCH (seeker:Person {id: $id})-[:HAS_SKILL]->(shared:Skill)<-[:HAS_SKILL]-(mentor:Person)\nWHERE mentor.id <> seeker.id\nRETURN mentor, collect(DISTINCT shared) AS sharedSkills\nORDER BY size(sharedSkills) DESC',
};

export const PATH_QUERY: GraphQueryInfo = {
  store: 'CognoDB',
  name: 'shortestPath',
  pattern:
    '(Person)-[:HAS_SKILL|WORKS_AT|INTERESTED_IN|HIRES_FOR|RELATED_TO*..6]-(Person)',
  cypher:
    'MATCH (from:Person {id: $from}), (to:Person {id: $to})\nMATCH path = shortestPath(\n  (from)-[:HAS_SKILL|WORKS_AT|INTERESTED_IN|HIRES_FOR|RELATED_TO*..6]-(to)\n)\nRETURN path',
};

export const RELATED_SKILL_QUERY: GraphQueryInfo = {
  store: 'CognoDB',
  name: 'relatedSkills',
  pattern: '(Person)-[:HAS_SKILL]->(Skill)-[:RELATED_TO]-(Skill)',
  cypher:
    'MATCH (p:Person {id: $id})-[:HAS_SKILL]->(owned:Skill)-[:RELATED_TO]-(related:Skill)\nWHERE NOT (p)-[:HAS_SKILL]->(related)\nRETURN DISTINCT related, owned.name AS via',
};
