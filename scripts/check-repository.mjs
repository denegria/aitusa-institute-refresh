import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const fail = (message) => {
  console.error(`repository check failed: ${message}`);
  process.exitCode = 1;
};

const requiredFiles = [
  "AGENTS.md",
  ".github/workflows/validate.yml",
  ".github/pull_request_template.md",
  "docs/release-packet-template.md",
  "scripts/verify-release-surfaces.mjs",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`missing ${file}`);
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
for (const script of ["test", "check:repository", "verify:release-surfaces", "validate"]) {
  if (!packageJson.scripts?.[script]) fail(`missing npm script ${script}`);
}

const contract = readFileSync("AGENTS.md", "utf8");
for (const phrase of ["Next.js 16", "npm run validate", "explicit Alvaro approval", "Sentry"]) {
  if (!contract.includes(phrase)) fail(`AGENTS.md must include ${phrase}`);
}

const releasePacket = readFileSync("docs/release-packet-template.md", "utf8");
for (const field of ["Issue", "Brief/reference", "Candidate commit", "Validation", "Visual evidence", "Deployment URL", "Sentry status", "Approval state"]) {
  if (!releasePacket.includes(field)) fail(`release packet missing ${field}`);
}

for (const legacyPath of ["index.html", "src/main.js"]) {
  if (existsSync(legacyPath)) fail(`obsolete static-site file still present: ${legacyPath}`);
}

const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n");
const forbidden = tracked.filter((file) =>
  /(^|\/)(\.env($|\.)|\.next\/|screenshots\/|\.chrome-profile\/)/.test(file),
);
if (forbidden.length) fail(`generated or sensitive paths are tracked: ${forbidden.join(", ")}`);

if (!process.exitCode) console.log("repository contract passed");
