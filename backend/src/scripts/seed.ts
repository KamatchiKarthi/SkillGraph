import { getDriver, closeDriver, withSession } from '../infrastructure/neo4j/driver.js';
import { logger } from '../utils/logger.js';

const people = [
  { id: 'p-ava', name: 'Ava Chen', title: 'Staff Frontend Engineer', bio: 'Design systems and React performance.' },
  { id: 'p-ben', name: 'Ben Okonkwo', title: 'Backend Engineer', bio: 'APIs, graphs, and data modeling.' },
  { id: 'p-cara', name: 'Cara Singh', title: 'Engineering Manager', bio: 'Mentors product-minded engineers.' },
  { id: 'p-diego', name: 'Diego Alvarez', title: 'Data Engineer', bio: 'Pipelines and analytics platforms.' },
  { id: 'p-emma', name: 'Emma Brooks', title: 'Product Designer', bio: 'UX research and interaction design.' },
  { id: 'p-farid', name: 'Farid Hassan', title: 'DevOps Engineer', bio: 'CI/CD and cloud reliability.' },
  { id: 'p-gina', name: 'Gina Park', title: 'Full-Stack Engineer', bio: 'Ships end-to-end product features.' },
  { id: 'p-hiro', name: 'Hiro Tanaka', title: 'ML Engineer', bio: 'Recommendation and ranking systems.' },
  { id: 'p-isla', name: 'Isla Novak', title: 'Security Engineer', bio: 'AppSec and threat modeling.' },
  { id: 'p-jon', name: 'Jon Reyes', title: 'Mobile Engineer', bio: 'React Native and iOS craft.' },
  { id: 'p-kira', name: 'Kira Mensah', title: 'SRE', bio: 'Observability and incident response.' },
  { id: 'p-leo', name: 'Leo Bergman', title: 'Platform Engineer', bio: 'Developer platforms and DX.' },
  { id: 'p-maya', name: 'Maya Patel', title: 'Junior Frontend Engineer', bio: 'Learning React and TypeScript.' },
  { id: 'p-noah', name: 'Noah Kim', title: 'QA Lead', bio: 'Test strategy and automation.' },
  { id: 'p-olivia', name: 'Olivia Grant', title: 'CTO', bio: 'Technical strategy and mentoring.' },
  { id: 'p-priya', name: 'Priya Nair', title: 'Data Scientist', bio: 'Experimentation and causal inference.' },
  { id: 'p-quinn', name: 'Quinn Walsh', title: 'Solutions Architect', bio: 'Customer graph use cases.' },
  { id: 'p-rina', name: 'Rina Sato', title: 'UX Researcher', bio: 'Discovery interviews and synthesis.' },
  { id: 'p-sam', name: 'Sam Ortega', title: 'Intern Engineer', bio: 'Curious about graphs and careers.' },
  { id: 'p-tess', name: 'Tess Jordan', title: 'Staff Backend Engineer', bio: 'Distributed systems and Neo4j.' },
];

const skills = [
  { id: 's-react', name: 'React', category: 'Frontend' },
  { id: 's-typescript', name: 'TypeScript', category: 'Language' },
  { id: 's-node', name: 'Node.js', category: 'Backend' },
  { id: 's-cypher', name: 'Cypher', category: 'Graph' },
  { id: 's-neo4j', name: 'Neo4j', category: 'Graph' },
  { id: 's-python', name: 'Python', category: 'Language' },
  { id: 's-sql', name: 'SQL', category: 'Data' },
  { id: 's-system-design', name: 'System Design', category: 'Architecture' },
  { id: 's-ux', name: 'UX Design', category: 'Design' },
  { id: 's-figma', name: 'Figma', category: 'Design' },
  { id: 's-aws', name: 'AWS', category: 'Cloud' },
  { id: 's-k8s', name: 'Kubernetes', category: 'Cloud' },
  { id: 's-ml', name: 'Machine Learning', category: 'AI' },
  { id: 's-security', name: 'Application Security', category: 'Security' },
  { id: 's-testing', name: 'Test Automation', category: 'Quality' },
  { id: 's-leadership', name: 'Engineering Leadership', category: 'Soft Skill' },
  { id: 's-communication', name: 'Technical Communication', category: 'Soft Skill' },
  { id: 's-graphql', name: 'GraphQL', category: 'API' },
  { id: 's-observability', name: 'Observability', category: 'Ops' },
  { id: 's-product', name: 'Product Thinking', category: 'Product' },
];

const companies = [
  { id: 'c-northwind', name: 'Northwind Labs', industry: 'SaaS' },
  { id: 'c-graphly', name: 'Graphly', industry: 'Developer Tools' },
  { id: 'c-orbit', name: 'Orbit Health', industry: 'Healthcare' },
  { id: 'c-pixel', name: 'Pixel & Co', industry: 'Design Agency' },
  { id: 'c-cloudspan', name: 'Cloudspan', industry: 'Cloud Infrastructure' },
  { id: 'c-signal', name: 'SignalAI', industry: 'Artificial Intelligence' },
  { id: 'c-trustgate', name: 'TrustGate', industry: 'Cybersecurity' },
  { id: 'c-mobilebay', name: 'MobileBay', industry: 'Consumer Apps' },
];

const roles = [
  { id: 'r-fe', name: 'Frontend Engineer', level: 'IC' },
  { id: 'r-be', name: 'Backend Engineer', level: 'IC' },
  { id: 'r-fs', name: 'Full-Stack Engineer', level: 'IC' },
  { id: 'r-em', name: 'Engineering Manager', level: 'Manager' },
  { id: 'r-de', name: 'Data Engineer', level: 'IC' },
  { id: 'r-sre', name: 'Site Reliability Engineer', level: 'IC' },
  { id: 'r-ml', name: 'ML Engineer', level: 'IC' },
  { id: 'r-sec', name: 'Security Engineer', level: 'IC' },
  { id: 'r-design', name: 'Product Designer', level: 'IC' },
  { id: 'r-staff', name: 'Staff Engineer', level: 'Senior IC' },
];

const personSkills: Record<string, string[]> = {
  'p-ava': ['s-react', 's-typescript', 's-system-design', 's-communication'],
  'p-ben': ['s-node', 's-cypher', 's-neo4j', 's-typescript'],
  'p-cara': ['s-leadership', 's-product', 's-communication', 's-system-design'],
  'p-diego': ['s-python', 's-sql', 's-aws', 's-system-design'],
  'p-emma': ['s-ux', 's-figma', 's-product', 's-communication'],
  'p-farid': ['s-aws', 's-k8s', 's-observability', 's-node'],
  'p-gina': ['s-react', 's-node', 's-typescript', 's-graphql'],
  'p-hiro': ['s-python', 's-ml', 's-sql', 's-system-design'],
  'p-isla': ['s-security', 's-node', 's-typescript', 's-aws'],
  'p-jon': ['s-react', 's-typescript', 's-testing', 's-product'],
  'p-kira': ['s-observability', 's-k8s', 's-aws', 's-communication'],
  'p-leo': ['s-node', 's-k8s', 's-system-design', 's-typescript'],
  'p-maya': ['s-react', 's-typescript', 's-ux'],
  'p-noah': ['s-testing', 's-typescript', 's-communication', 's-product'],
  'p-olivia': ['s-leadership', 's-system-design', 's-product', 's-communication'],
  'p-priya': ['s-python', 's-ml', 's-sql', 's-product'],
  'p-quinn': ['s-neo4j', 's-cypher', 's-system-design', 's-communication'],
  'p-rina': ['s-ux', 's-product', 's-communication', 's-figma'],
  'p-sam': ['s-react', 's-node', 's-typescript'],
  'p-tess': ['s-neo4j', 's-cypher', 's-node', 's-system-design'],
};

const personCompanies: Record<string, string> = {
  'p-ava': 'c-northwind',
  'p-ben': 'c-graphly',
  'p-cara': 'c-northwind',
  'p-diego': 'c-orbit',
  'p-emma': 'c-pixel',
  'p-farid': 'c-cloudspan',
  'p-gina': 'c-graphly',
  'p-hiro': 'c-signal',
  'p-isla': 'c-trustgate',
  'p-jon': 'c-mobilebay',
  'p-kira': 'c-cloudspan',
  'p-leo': 'c-cloudspan',
  'p-maya': 'c-northwind',
  'p-noah': 'c-orbit',
  'p-olivia': 'c-graphly',
  'p-priya': 'c-signal',
  'p-quinn': 'c-graphly',
  'p-rina': 'c-pixel',
  'p-sam': 'c-northwind',
  'p-tess': 'c-graphly',
};

const personRoles: Record<string, string[]> = {
  'p-ava': ['r-fe', 'r-staff'],
  'p-ben': ['r-be'],
  'p-cara': ['r-em'],
  'p-diego': ['r-de'],
  'p-emma': ['r-design'],
  'p-farid': ['r-sre'],
  'p-gina': ['r-fs'],
  'p-hiro': ['r-ml'],
  'p-isla': ['r-sec'],
  'p-jon': ['r-fe'],
  'p-kira': ['r-sre'],
  'p-leo': ['r-be', 'r-staff'],
  'p-maya': ['r-fe'],
  'p-noah': ['r-fs'],
  'p-olivia': ['r-em', 'r-staff'],
  'p-priya': ['r-ml'],
  'p-quinn': ['r-be'],
  'p-rina': ['r-design'],
  'p-sam': ['r-fs'],
  'p-tess': ['r-be', 'r-staff'],
};

const companyRoles: Record<string, string[]> = {
  'c-northwind': ['r-fe', 'r-em', 'r-fs'],
  'c-graphly': ['r-be', 'r-fs', 'r-staff'],
  'c-orbit': ['r-de', 'r-fs'],
  'c-pixel': ['r-design'],
  'c-cloudspan': ['r-sre', 'r-be'],
  'c-signal': ['r-ml', 'r-de'],
  'c-trustgate': ['r-sec'],
  'c-mobilebay': ['r-fe'],
};

const skillRelations: Array<[string, string]> = [
  ['s-react', 's-typescript'],
  ['s-react', 's-ux'],
  ['s-node', 's-typescript'],
  ['s-cypher', 's-neo4j'],
  ['s-neo4j', 's-system-design'],
  ['s-python', 's-ml'],
  ['s-python', 's-sql'],
  ['s-aws', 's-k8s'],
  ['s-k8s', 's-observability'],
  ['s-ux', 's-figma'],
  ['s-ux', 's-product'],
  ['s-leadership', 's-communication'],
  ['s-testing', 's-typescript'],
  ['s-security', 's-node'],
  ['s-graphql', 's-node'],
  ['s-ml', 's-sql'],
  ['s-product', 's-communication'],
  ['s-system-design', 's-leadership'],
];

async function seed(): Promise<void> {
  getDriver();
  logger.info('Seeding CognoDB skill graph');

  await withSession(async (session) => {
    await session.executeWrite(async (tx) => {
      await tx.run(`
        CREATE CONSTRAINT person_id IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE
      `);
      await tx.run(`
        CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE
      `);
      await tx.run(`
        CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE
      `);
      await tx.run(`
        CREATE CONSTRAINT role_id IF NOT EXISTS FOR (r:Role) REQUIRE r.id IS UNIQUE
      `);

      for (const person of people) {
        await tx.run(
          `MERGE (p:Person {id: $id})
           SET p.name = $name, p.title = $title, p.bio = $bio`,
          person,
        );
      }

      for (const skill of skills) {
        await tx.run(
          `MERGE (s:Skill {id: $id})
           SET s.name = $name, s.category = $category`,
          skill,
        );
      }

      for (const company of companies) {
        await tx.run(
          `MERGE (c:Company {id: $id})
           SET c.name = $name, c.industry = $industry`,
          company,
        );
      }

      for (const role of roles) {
        await tx.run(
          `MERGE (r:Role {id: $id})
           SET r.name = $name, r.level = $level`,
          role,
        );
      }

      for (const [personId, skillIds] of Object.entries(personSkills)) {
        for (const skillId of skillIds) {
          await tx.run(
            `MATCH (p:Person {id: $personId}), (s:Skill {id: $skillId})
             MERGE (p)-[:HAS_SKILL]->(s)`,
            { personId, skillId },
          );
        }
      }

      for (const [personId, companyId] of Object.entries(personCompanies)) {
        await tx.run(
          `MATCH (p:Person {id: $personId}), (c:Company {id: $companyId})
           MERGE (p)-[:WORKS_AT]->(c)`,
          { personId, companyId },
        );
      }

      for (const [personId, roleIds] of Object.entries(personRoles)) {
        for (const roleId of roleIds) {
          await tx.run(
            `MATCH (p:Person {id: $personId}), (r:Role {id: $roleId})
             MERGE (p)-[:INTERESTED_IN]->(r)`,
            { personId, roleId },
          );
        }
      }

      for (const [companyId, roleIds] of Object.entries(companyRoles)) {
        for (const roleId of roleIds) {
          await tx.run(
            `MATCH (c:Company {id: $companyId}), (r:Role {id: $roleId})
             MERGE (c)-[:HIRES_FOR]->(r)`,
            { companyId, roleId },
          );
        }
      }

      for (const [left, right] of skillRelations) {
        await tx.run(
          `MATCH (a:Skill {id: $left}), (b:Skill {id: $right})
           MERGE (a)-[:RELATED_TO]->(b)`,
          { left, right },
        );
      }
    });
  });

  const nodeCount =
    people.length + skills.length + companies.length + roles.length;
  logger.info('Seed complete', {
    nodes: nodeCount,
    people: people.length,
    skills: skills.length,
    companies: companies.length,
    roles: roles.length,
  });

  await closeDriver();
}

seed().catch(async (error) => {
  logger.error('Seed failed', {
    message: error instanceof Error ? error.message : 'unknown',
  });
  await closeDriver();
  process.exit(1);
});
