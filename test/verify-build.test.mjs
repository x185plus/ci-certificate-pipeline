import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Build produces valid artifact', async () => {
  const artifactPath = path.resolve('dist/test-artifact.json');
  assert.ok(fs.existsSync(artifactPath), 'Artifact file dist/test-artifact.json must exist');

  const content = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  assert.equal(content.name, 'x185plus-provenance-demo');
  assert.equal(content.version, '1.0.0');
  assert.equal(content.engine, 'X185Plus Public Attestation Route');
  assert.ok(content.builtAt, 'builtAt timestamp must be present');
});
