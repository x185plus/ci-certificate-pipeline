import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const outDir = path.resolve('dist');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const buildMeta = {
  name: "x185plus-provenance-demo",
  version: "1.0.0",
  engine: "X185Plus Public Attestation Route",
  builtAt: new Date().toISOString(),
  gitSha: process.env.GITHUB_SHA || "local-build",
  runId: process.env.GITHUB_RUN_ID || "local-run",
  repository: process.env.GITHUB_REPOSITORY || "x185plus/ci-certificate-pipeline"
};

const artifactPath = path.join(outDir, 'test-artifact.json');
fs.writeFileSync(artifactPath, JSON.stringify(buildMeta, null, 2));

const content = fs.readFileSync(artifactPath);
const sha256 = crypto.createHash('sha256').update(content).digest('hex');

console.log("=========================================");
console.log("  X185Plus Public Build & Attestation   ");
console.log("=========================================");
console.log(`  Artifact: ${artifactPath}`);
console.log(`  SHA-256 : ${sha256}`);
console.log(`  Built At: ${buildMeta.builtAt}`);
console.log(`  Git SHA : ${buildMeta.gitSha}`);
console.log("=========================================");
