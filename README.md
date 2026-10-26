# X185Plus CI Certificate Pipeline

Official public test route and demonstration repository for X185Plus provenance attestation, SLSA verification, and Sigstore signing.

## CI Status

[![Test Sigstore Build Provenance](https://github.com/x185plus/ci-certificate-pipeline/actions/workflows/attest.yml/badge.svg)](https://github.com/x185plus/ci-certificate-pipeline/actions/workflows/attest.yml)

## Overview

This repository demonstrates cryptographic supply-chain build provenance attestations generated via GitHub Actions and Sigstore OIDC under the [in-toto Statement v1](https://in-toto.io/) and [SLSA Provenance v1](https://slsa.dev/provenance/v1) specifications.

### How Attestation Works

1. **Build Artifact Generation**: A deterministic build artifact is produced and digested using SHA-256.
2. **Sigstore Fulcio OIDC Attestation**: GitHub Actions requests an ephemeral short-lived X.509 signing certificate from GitHub's internal Sigstore Fulcio CA using the job's OIDC ID token.
3. **Rekor Transparency Log Entry**: The signed DSSE envelope is published and anchored to the transparency log.
4. **Public Verification**: Anyone can verify the artifact using GitHub CLI:
   ```bash
   gh attestation verify dist/test-artifact.json --owner x185plus
   ```

---
*Maintained by X185Plus Governance Systems.*
