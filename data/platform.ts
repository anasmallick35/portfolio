/** Sheet 02 — Talview recruitment platform, sectional elevation.
 *  UPPER = feature domains. LOWER = the platform layers they stand on. */
export type Block = { k: string; t: string; d: string; g: string[] };

export const UPPER: Block[] = [
  {
    k: "WORKFLOW",
    t: "Job requisition dashboard & creation",
    d: "The largest surface in the module at 642 files. Requisition list with filters and collaborators, the job-description editor, and a multi-step creation wizard that has to hold partial state across every step without losing a draft.",
    g: ["642 FILES", "WIZARD", "JD EDITOR", "FILTERS"],
  },
  {
    k: "PIPELINE",
    t: "Virtualized candidate grid",
    d: "A TanStack Table + Virtual grid with grouped assessment and interview column headers, per-user persisted column-visibility preferences, additional-field filters, phone and keyword search, and a separate card view on mobile. Thousands of rows, no jank.",
    g: ["TANSTACK", "VIRTUALIZED", "PERSISTED PREFS", "MOBILE"],
  },
  {
    k: "BULK DOCK",
    t: "Multi-select action dock",
    d: "Select candidates, act on all of them: invite, schedule interview, change status, resend form, assign evaluator, cancel interview. Each action is its own side-panel flow backed by its own slice and saga, so one failing action can't corrupt the others.",
    g: ["REDUX-SAGA", "SIDE PANELS", "6 ACTIONS"],
  },
  {
    k: "AUTOMATION",
    t: "Catalog-driven rule engine",
    d: "A trigger → condition → action engine covering the screening, assessment and interview stages. Rules are defined against a catalog rather than hard-coded, and the whole rollout sat behind GrowthBook feature flags so it could be switched on per customer.",
    g: ["TRIGGER→COND→ACTION", "GROWTHBOOK", "CATALOG-DRIVEN"],
  },
  {
    k: "EVALUATION",
    t: "Multi-mode evaluation workspace",
    d: "Pluggable step types so new evaluation formats drop in without a rewrite, plus in-browser VoIP calling, proctoring session playback, and MediaPipe face verification running client-side.",
    g: ["PLUGGABLE STEPS", "VoIP", "PROCTORING", "MEDIAPIPE"],
  },
  {
    k: "SCHEDULING",
    t: "Interview scheduling, end to end",
    d: "Recruitment drives, calendar and day views, interviewer assignment, candidate self-scheduling and a full RSVP suite — all timezone-correct via Luxon, which is most of the actual difficulty.",
    g: ["DRIVES", "SELF-SCHEDULING", "RSVP", "LUXON"],
  },
  {
    k: "RESUME AI",
    t: "GenAI resume fitment",
    d: "A BlockNote rich-text editor where hiring criteria are split into essentials, preferred and optional — that structured criteria set is what drives the AI resume scoring downstream.",
    g: ["BLOCKNOTE", "AI SCORING", "CRITERIA MODEL"],
  },
];

export const LOWER: Block[] = [
  {
    k: "DATA LAYER · RxDB",
    t: "Offline-first data with GraphQL replication",
    d: "The change I'm proudest of. An RxDB data layer with GraphQL replication, versioned schemas and migration strategies, replacing ad-hoc Apollo fetching across 300+ files. Reads come from the local store, replication reconciles in the background, and redundant network round-trips largely disappeared. Apollo stayed for one-off RPCs and uploads, where a live query is the wrong tool.",
    g: ["RxDB", "GRAPHQL REPLICATION", "VERSIONED SCHEMAS", "300+ FILES"],
  },
  {
    k: "TESERRA · DESIGN SYSTEM",
    t: "In-house atoms / molecules / organisms",
    d: "Teserra is the design system we built in-house rather than buying. Atoms, molecules and organisms with 168 Storybook stories, so a new feature surface composes instead of reinventing its own buttons and tables.",
    g: ["ATOMIC DESIGN", "168 STORIES", "IN-HOUSE"],
  },
  {
    k: "QUALITY GATES",
    t: "Tests, accessibility, internationalization",
    d: "590 Jest and React Testing Library specs, 42 Cypress end-to-end suites, WCAG 2.2 AA compliance enforced with jest-axe, and full internationalization across 1,400+ message keys. The gates are what let a 220k-line module keep moving.",
    g: ["590 SPECS", "42 E2E", "WCAG 2.2 AA", "1,400+ KEYS"],
  },
  {
    k: "OBSERVABILITY",
    t: "Production instrumentation",
    d: "Mixpanel analytics, Sentry error tracking and structured logging wired through the module, so a regression is something we see rather than something a customer reports.",
    g: ["MIXPANEL", "SENTRY", "STRUCTURED LOGS"],
  },
];
