import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** eslint-config-next 16 ships native flat configs — no FlatCompat bridge needed. */
const config = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },
];

export default config;
