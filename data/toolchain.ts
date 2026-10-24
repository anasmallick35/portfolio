/** Sheet 03 — skills as callable parts, each with real expertise + official docs. */
export type Part = {
  n: string;
  c: string;
  xp: string;
  u: string;
  list?: [string, string][];
};

export const INNER: Part[] = [
  { n: "React", c: "UI", u: "https://react.dev",
    xp: "React 18 across a 220k-LOC module spanning 21 feature domains. Suspense boundaries and concurrent rendering on the surfaces that actually hurt — the requisition wizard and the candidate grid." },
  { n: "TypeScript", c: "LANG", u: "https://www.typescriptlang.org/docs/",
    xp: "Strict mode end to end, no implicit any. RxDB schema types and GraphQL operation types are generated rather than hand-written, so a schema change breaks the build instead of production." },
  { n: "RxDB", c: "DATA", u: "https://rxdb.info/",
    xp: "Built the offline-first data layer: GraphQL replication, versioned schemas and migration strategies, replacing ad-hoc Apollo fetching across 300+ files. Reads hit the local store; replication reconciles in the background." },
  { n: "GraphQL", c: "API", u: "https://graphql.org/learn/",
    xp: "The replication protocol underneath RxDB, plus Apollo Client for one-off RPCs and uploads where a live query is the wrong tool. Schema-first, with resolvers and operations typed from the schema." },
  { n: "Apollo", c: "API", u: "https://www.apollographql.com/docs/react",
    xp: "Kept deliberately narrow after the RxDB migration — mutations, uploads and one-shot RPCs only, instead of being the general-purpose fetch layer it had become." },
  { n: "TanStack", c: "UI", u: "https://tanstack.com/table/latest",
    xp: "Table + Virtual for the candidate pipeline grid: grouped assessment/interview column headers, per-user persisted column visibility, server-side filtering, thousands of rows rendered without jank." },
  { n: "Redux-Saga", c: "STATE", u: "https://redux-saga.js.org/",
    xp: "Every bulk action is its own slice and saga — invite, schedule interview, change status, resend form, assign evaluator, cancel interview — so a failure in one never corrupts another." },
  { n: "Turborepo", c: "BUILD", u: "https://turborepo.com/docs",
    xp: "The monorepo build graph that made the v7 → v8 migration survivable: shared packages, cached tasks, and a dependency graph that tells you what a change actually breaks." },
  { n: "Teserra", c: "DS", u: "https://storybook.js.org/docs",
    xp: "Our in-house design system, built rather than bought. Atoms / molecules / organisms with 168 Storybook stories, so new surfaces compose instead of reinventing buttons and tables." },
  { n: "Next.js", c: "FW", u: "https://nextjs.org/docs",
    xp: "App Router and server components on the side projects — Career OS runs on it, and so does this sheet set. Used where the page genuinely benefits from rendering on the server, not by default." },
  { n: "Node.js", c: "RT", u: "https://nodejs.org/docs/latest/api/",
    xp: "Service layer and background workers; the runtime underneath every build tool and agent harness I run." },
];

export const OUTER: Part[] = [
  { n: "coding agents", c: "AGENT", u: "https://docs.claude.com/en/docs/claude-code/overview",
    xp: "My primary way of working. I run a dozen agent sessions at once, each sandboxed on its own branch, and I write the harness they run inside so the output comes back close to mergeable. I've adapted mid-project between agents — including a mid-way Codex shift on the workflow-automation feature.",
    list: [
      ["Claude Code", "primary runtime · skills, subagents, hooks"],
      ["Codex", "adopted mid-project on automation"],
      ["Cursor", "inline editing"],
      ["Aider", "open source · git-native"],
      ["Cline", "open source · VS Code"],
      ["OpenHands", "open source · autonomous"],
      ["Continue", "open source · extensible"],
    ] },
  { n: "MCP", c: "AGENT", u: "https://modelcontextprotocol.io/",
    xp: "Model Context Protocol servers wired into the agent runtime — the mechanism that gives an agent real tools instead of guesses. Four connected, eighteen tools exposed." },
  { n: "subagents", c: "AGENT", u: "https://docs.claude.com/en/docs/claude-code/sub-agents",
    xp: "Six typed roles — audit, feature, bug, tech-debt, verify, review — so a task is routed to a prompt built for it rather than one general-purpose agent doing everything badly." },
  { n: "skills", c: "AGENT", u: "https://docs.claude.com/en/docs/claude-code/overview",
    xp: "27 authored. A skill encodes how a specific kind of work should be done here, so the standard lives in the repo rather than in whoever happens to review the PR." },
  { n: "hooks", c: "AGENT", u: "https://docs.claude.com/en/docs/claude-code/hooks",
    xp: "Pre-commit and pre-merge gates that run on the agent, not just on CI. Cheaper to catch a problem before the commit exists than after it's in a PR." },
  { n: "DevPod", c: "INFRA", u: "https://devpod.sh/docs",
    xp: "Up to twelve containers running in parallel, each with its own branch and its own agent session. Parallelism is only worth anything if the branches stay isolated — that's what the containers buy." },
  { n: "Cypress", c: "TEST", u: "https://docs.cypress.io",
    xp: "42 end-to-end suites covering workflow creation, the candidate pipeline, evaluation and scheduling. Written so a rule-engine change can't silently break screening." },
  { n: "Playwright", c: "TEST", u: "https://playwright.dev/docs/intro",
    xp: "Cross-browser runs and trace-based debugging where Cypress's single-browser model isn't enough." },
  { n: "Jest + RTL", c: "TEST", u: "https://testing-library.com/docs/react-testing-library/intro/",
    xp: "590 specs. Tested through the accessibility tree rather than implementation details, which is also what keeps the jest-axe WCAG 2.2 AA checks honest." },
  { n: "GrowthBook", c: "OPS", u: "https://docs.growthbook.io/",
    xp: "Feature flags that let the automation engine roll out per customer instead of all at once — the difference between a launch and an incident." },
];
