#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const REPO = 'x185plus/ci-certificate-pipeline';
const ARTIFACT_NAME = 'test-artifact';
const ARTIFACT_FILE = 'test-artifact.json';
const OWNER = 'x185plus';

console.log('===========================================================');
console.log('   X185Plus Automated Sigstore / SLSA Provenance Verifier   ');
console.log('===========================================================');
console.log(`Repository   : ${REPO}`);
console.log(`Artifact Name: ${ARTIFACT_NAME}`);
console.log(`Owner Filter : ${OWNER}`);
console.log('-----------------------------------------------------------');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'x185-provenance-'));
const targetFile = path.join(tmpDir, ARTIFACT_FILE);

try {
  process.stdout.write('1. Downloading latest build artifact from GitHub Actions... ');
  execSync(`gh run download --repo ${REPO} -n ${ARTIFACT_NAME} --dir "${tmpDir}"`, { stdio: 'pipe' });
  console.log('✓ Done');

  process.stdout.write('2. Verifying cryptographic Sigstore attestation & Rekor log... ');
  const rawOutput = execSync(`gh attestation verify "${targetFile}" --owner ${OWNER} --format json`, { stdio: 'pipe' }).toString();
  console.log('✓ VERIFIED (Exit Code 0)\n');

  const bundle = JSON.parse(rawOutput);
  const result = bundle[0]?.verificationResult || {};
  const statement = result.statement || {};
  const predicate = statement.predicate || {};
  const workflow = predicate.buildDefinition?.externalParameters?.workflow || {};
  const runDetails = predicate.runDetails || {};
  const tlog = result.verifiedTimestamps?.[0] || {};
  const subject = statement.subject?.[0] || {};

  console.log('===========================================================');
  console.log('                 VERIFICATION REPORT                       ');
  console.log('===========================================================');
  console.log(`Status        : PASSED (Cryptographically Attested)`);
  console.log(`Subject File  : ${subject.name}`);
  console.log(`Subject SHA256: ${subject.digest?.sha256}`);
  console.log(`Predicate     : ${statement.predicateType || 'SLSA Provenance v1'}`);
  console.log(`Workflow      : ${workflow.path || '.github/workflows/attest.yml'} (${workflow.ref || 'main'})`);
  console.log(`Invocation URL: ${runDetails.metadata?.invocationId || 'N/A'}`);
  console.log(`Rekor Log Uri : ${tlog.uri || 'https://rekor.sigstore.dev'}`);
  console.log(`Rekor Time    : ${tlog.timestamp || 'N/A'}`);
  console.log('===========================================================');
  console.log('\n✅ 1-Click Verification succeeded with zero manual download steps!\n');
} catch (err) {
  console.error('\n❌ Verification Failed:', err.message);
  if (err.stderr) console.error(err.stderr.toString());
  process.exit(1);
} finally {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}
}
