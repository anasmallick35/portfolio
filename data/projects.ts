/** Sheet 04 — exploded assembly. Every component links to its README. */
export type Component = {
  pn: string;
  t: string;
  s: string;
  repo: string;
  d: string;
  parts: string[];
  stack: string[];
};

export const COMPONENTS: Component[] = [
  { pn: "A-01", t: "AOL", s: "CONTEXT INTEGRITY FOR AI AGENTS",
    repo: "https://github.com/anasmallick35/aol#readme",
    d: "Long agent sessions get compacted, and compaction silently drops things that mattered. AOL detects what was lost, repairs it, and proves the repair held — instrumenting the one failure mode that agent harnesses currently have no answer for.",
    parts: ["TYPESCRIPT", "AGENT RUNTIME", "EVALS", "CLI"],
    stack: ["loss detector", "repair pass", "proof harness", "CLI surface"] },
  { pn: "A-02", t: "Talview agent ecosystem", s: "THE DELIVERY PIPELINE MY TEAM RUNS ON",
    repo: "https://github.com/anasmallick35/talview-agent-ecosystem#readme",
    d: "Skills for the audit, feature, bug and tech-debt tracks; a browser-verification step that drives the real running app and captures evidence; and a learn step that harvests human PR review comments and turns them into enforced rules, so the same note is never given twice.",
    parts: ["CLAUDE CODE", "MCP", "SUBAGENTS", "SHELL"],
    stack: ["track skills", "browser verify", "review rules", "learn loop"] },
  { pn: "A-03", t: "Career OS", s: "CAREER INTELLIGENCE PLATFORM",
    repo: "https://github.com/anasmallick35/career-os#readme",
    d: "Global job discovery, resume optimisation and opportunity matching driven by model inference rather than keyword overlap — the matching problem job boards consistently get wrong.",
    parts: ["NEXT.JS", "LLM", "POSTGRES"],
    stack: ["listing ingest", "match engine", "resume pass", "UI"] },
  { pn: "A-04", t: "Mock Interview Prep", s: "INTERVIEW QUESTION GENERATION",
    repo: "https://github.com/anasmallick35/Mock-Interview-Prep#readme",
    d: "Generates interview questions against a role and difficulty, with saved sessions and progress tracking. Typed end to end — GraphQL schema through to the React components.",
    parts: ["GRAPHQL", "POSTGRES", "REDUX-SAGA", "TAILWIND", "TS"],
    stack: ["schema", "generator", "session store", "UI"] },
  { pn: "A-05", t: "Inventory Management", s: "MERN · FIRST FULL-STACK BUILD",
    repo: "https://github.com/anasmallick35/inventory_frontend#readme",
    d: "End-to-end inventory app with authentication, image-backed product management and email-confirmed password recovery. The project where I first had to own a whole system rather than a screen.",
    parts: ["MONGODB", "EXPRESS", "REACT", "NODE"],
    stack: ["auth", "products", "media", "recovery"] },
];
