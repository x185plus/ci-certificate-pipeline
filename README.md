# X185Plus CI Certificate Pipeline

Official public test route and demonstration repository for X185Plus provenance attestation, SLSA verification, and Sigstore signing.

## CI Status & Attestation Badge

[![Test Sigstore Build Provenance](https://github.com/x185plus/ci-certificate-pipeline/actions/workflows/attest.yml/badge.svg)](https://github.com/x185plus/ci-certificate-pipeline/actions/workflows/attest.yml)

👉 **[View Verified Attestations on GitHub (1-Click)](https://github.com/x185plus/ci-certificate-pipeline/attestations)**

---

## Overview

This repository demonstrates cryptographic supply-chain build provenance attestations generated via GitHub Actions and Sigstore OIDC under the [in-toto Statement v1](https://in-toto.io/) and [SLSA Provenance v1](https://slsa.dev/provenance/v1) specifications.

### How Attestation Works

1. **Build Artifact Generation**: `npm run build` executes [`scripts/build.mjs`](file:///scripts/build.mjs) to compile and digest the build payload using SHA-256.
2. **Deterministic Build Test**: `npm test` executes [`test/verify-build.test.mjs`](file:///test/verify-build.test.mjs) using Node's native test runner to prove payload integrity prior to attestation.
3. **Sigstore Fulcio OIDC Attestation**: GitHub Actions requests an ephemeral short-lived X.509 signing certificate from GitHub's internal Sigstore Fulcio CA using the job's OIDC ID token.
4. **Rekor Transparency Log Entry**: The signed DSSE envelope is published and anchored to the global [Rekor Public Transparency Log](https://rekor.sigstore.dev).
5. **1-Click Public Verification**:
   - Anyone can view the cryptographic attestation directly in GitHub's UI: [Attestation Ledger](https://github.com/x185plus/ci-certificate-pipeline/attestations).
   - Or verify locally via GitHub CLI:
     ```bash
     gh run download --repo x185plus/ci-certificate-pipeline -n test-artifact
     gh attestation verify test-artifact.json --owner x185plus
     ```

### Compliance Scope & Honesty
* **Provenance, Not Code Quality:** This attestation cryptographically proves *where* and *how* the artifact was built (isolated GitHub runner, commit SHA, workflow reference). It proves build chain immutability without making unverified runtime quality claims.

---
*Maintained by X185Plus Governance Systems.*
