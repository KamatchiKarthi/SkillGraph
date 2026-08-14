# SkillGraph — CognoDB Career Mentorship Graph

Internal mentor matching for a company: find employees, see their skills, and suggest mentors who share those skills.

**Real-world product this is like:** [Together](https://www.togetherplatform.com/) — companies use it so new hires and juniors can find a mentor inside the organization, instead of guessing who to ask.

MongoDB is replaced by **CognoDB** (Neo4j-compatible). Mentorship matching is stored and queried as a graph.

## Why CognoDB (graph), not tables

Mentorship is a path:

```text
Person -[:HAS_SKILL]-> Skill <-[:HAS_SKILL]- Person
Person -[:WORKS_AT]-> Company <-[:WORKS_AT]- Person
Skill -[:RELATED_TO]- Skill
```

SQL needs many self-joins. Cypher walks the same edges with `MATCH` and `shortestPath`.

## Data model

| Node | Meaning |
| ---- | ------- |
| Person | Employee |
| Skill | Capability |
| Company | Employer |
| Role | Job target |

| Relationship | Meaning |
| ------------ | ------- |
| HAS_SKILL | Person knows a skill |
| WORKS_AT | Person belongs to a company |
| INTERESTED_IN | Person wants a role |
| HIRES_FOR | Company hires for a role |
| RELATED_TO | Two skills are adjacent |

Seed (idempotent `MERGE`): 20 people, 20 skills, 8 companies, 10 roles.

## How this app uses CognoDB

| Screen | Graph query |
| ------ | ----------- |
| Directory | `MATCH (p:Person)` search |
| Profile | `HAS_SKILL`, `WORKS_AT`, `INTERESTED_IN` |
| Related skills | `(Person)-[:HAS_SKILL]->(Skill)-[:RELATED_TO]-(Skill)` |
| Mentors | shared-skill 2-hop: `Person → Skill ← Person` |
| Connect | `shortestPath` up to 6 hops across relationship types |

All Cypher is parameterized (`$id`, `$from`, `$to`). Only the repository talks to `neo4j-driver`. Cypher stays in the backend and this README — the UI does not show query text.

## Environment files

`.env` and `.env.example` files are **gitignored** (root and `frontend/`). Do not commit secrets, passwords, or local templates.

Create the two files locally before you run the app.

### 1. Root `.env` (backend + CognoDB)

Create `.env` in the repo root:

```env
NEO4J_URI=bolt+s://YOUR_INSTANCE.databases.cognodb.com
NEO4J_USER=cognodb
NEO4J_PASSWORD=your-password-here

PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

| Variable | Required | Default | Used by | Meaning |
| -------- | -------- | ------- | ------- | ------- |
| `NEO4J_URI` | Yes | none | Backend CognoDB driver | Bolt URL from the CognoDB console. Use `bolt+s://` (or `neo4j+s://`) plus your instance host. |
| `NEO4J_USER` | Yes | `neo4j` | Backend CognoDB driver | Database username. CognoDB often uses `cognodb`. |
| `NEO4J_PASSWORD` | Yes | none | Backend CognoDB driver | Database password from the CognoDB console. Never commit this. |
| `PORT` | No | `4000` | Express API | Port for `http://localhost:4000`. |
| `NODE_ENV` | No | `development` | Backend | `development`, `production`, or `test`. |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Express CORS | Origin allowed to call the API. Must match the Vite app URL. |

The backend loads this file from the **repo root** (see `backend/src/config/env.ts`). Missing `NEO4J_URI` or `NEO4J_PASSWORD` stops the API from starting.

### 2. Frontend `frontend/.env`

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

| Variable | Required | Default | Used by | Meaning |
| -------- | -------- | ------- | ------- | ------- |
| `VITE_API_BASE_URL` | No | `http://localhost:4000` | Vite frontend | Base URL for `/api/...` calls. Vite only exposes variables that start with `VITE_`. Restart `npm run dev` after changing this file. |

If the frontend and API run on the defaults above, you can omit `frontend/.env`. Set it when the API is on another host or port.

### Local templates (optional)

You may keep local copies named `.env.example` and `frontend/.env.example` as reminders. Git ignores them. Treat README as the source of truth for variable names.

### Where to get CognoDB values

1. Open your CognoDB project.
2. Copy the Bolt connection URI into `NEO4J_URI`.
3. Copy the username into `NEO4J_USER`.
4. Copy the password into `NEO4J_PASSWORD`.
5. Save `.env`, then run `npm run seed` and `npm run dev`.

## Setup

```bash
npm install
npm run seed
npm run dev
npm run build
```

Create `.env` and optionally `frontend/.env` first (see **Environment files**).

Use `npm run build` (not `npm build`) to typecheck and build the API and web app.

- App: http://localhost:5173
- Health: http://localhost:4000/api/health
- Graph counts: http://localhost:4000/api/graph/stats

## How to use the UI

There is no login. Anyone with the app can browse the seeded company directory.

1. **Home** — Read what the product does, how to walk through it, and how mentor matches are assessed.
2. **Directory** — Search people by name or job title. Open a person to see their profile.
3. **Profile** — Skills, company, roles they want, related skills to learn next, and ranked mentor matches.
4. **Connect** — Pick two employees. The app shows the shortest workplace link (shared skill, same company, or related skill).

Typical walk:

Directory → open a person → scroll to **Mentor matches** → open a mentor profile, or use **How they connect** to see the intro path.

## How mentor matching is assessed

This is **skill-overlap assessment**, not interviews, ratings, or manager reviews.

| What you see | How it is decided |
| ------------ | ----------------- |
| Mentor list | Other people who share at least one skill with the person on the profile. The person is not matched to themselves. |
| Rank (`1`, `2`, `3`…) | More shared skills = higher rank. Rank `1` is labeled **Best match**. Equal overlap is ordered by name. |
| Why this mentor | The overlapping skill names. That is the reason they appear. |
| Shared skill count | Distinct skills both people have (`HAS_SKILL` on both). |
| Good next skills | Skills linked with `RELATED_TO` that the person does not already have. These are learning suggestions, not a mentor score. |
| Connect trail | Shortest path of at most 6 hops. This is a warm-intro map, not a quality score. |

Someone with 4 shared skills ranks above someone with 1 shared skill, even if they work at a different company. Company and role are shown for context; they do not change the mentor rank.

## Check that CognoDB has data

In the CognoDB console:

```cypher
MATCH (n)
UNWIND labels(n) AS label
RETURN label, count(*) AS total
```

```cypher
MATCH ()-[r]->()
RETURN type(r) AS type, count(*) AS total
```

Or open `/api/people?q=` — you should see Person nodes.

## Sample walks (from seed)

Use these after `npm run seed`. They are not hardcoded as UI shortcuts.

1. **Shared-skill mentors**  
   Open `/people/p-maya`. Mentor matches should include people who share React / TypeScript (for example Ava). Rank `1` has the most overlap.

2. **RELATED_TO expansion**  
   Same profile shows skills adjacent to Maya’s skills that she does not already have.

3. **shortestPath**  
   Connect page: From `Maya Patel` (`p-maya`) To `Tess Jordan` (`p-tess`).  
   The trail can go through skills, companies, or related skills.

4. **API**  
   - `GET /api/people/p-maya/mentors`  
   - `GET /api/people/p-maya/related-skills`  
   - `GET /api/paths?from=p-maya&to=p-tess`

## Cypher used in the product

**Mentors (assessment query)**

```cypher
MATCH (seeker:Person {id: $id})-[:HAS_SKILL]->(shared:Skill)<-[:HAS_SKILL]-(mentor:Person)
WHERE mentor.id <> seeker.id
RETURN mentor, collect(DISTINCT shared) AS sharedSkills
ORDER BY size(sharedSkills) DESC
```

**Shortest path**

```cypher
MATCH (from:Person {id: $from}), (to:Person {id: $to})
MATCH path = shortestPath(
  (from)-[:HAS_SKILL|WORKS_AT|INTERESTED_IN|HIRES_FOR|RELATED_TO*..6]-(to)
)
RETURN path
```

**Related skills**

```cypher
MATCH (p:Person {id: $id})-[:HAS_SKILL]->(owned:Skill)-[:RELATED_TO]-(related:Skill)
WHERE NOT (p)-[:HAS_SKILL]->(related)
RETURN DISTINCT related, owned.name AS via
```

## API

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET | `/api/health` | App + CognoDB |
| GET | `/api/graph/stats` | Node and relationship counts |
| GET | `/api/people?q=` | Search people |
| GET | `/api/people/:id` | Profile + neighbors |
| GET | `/api/people/:id/mentors` | Shared-skill mentors + Cypher meta |
| GET | `/api/people/:id/related-skills` | RELATED_TO expansion |
| GET | `/api/paths?from=&to=` | shortestPath + Cypher meta |
| GET | `/api/skills/:id/related` | Skill adjacency |

## Layout

```text
backend/src/   Clean Architecture, Cypher in repositories
frontend/src/  Feature modules, TanStack Query
```

Out of scope: auth, Redux, MongoDB, 3D graph libraries.
