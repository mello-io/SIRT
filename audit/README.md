# /audit — S.I.R.T. Security Hardening Documentation
> Security Incident Response Transcript — S.I.R.T.
> Version: v1.1 | April 2026
> Maintained by: [mello-io](https://github.com/mello-io/SIRT)

---

## What Is This Folder?

S.I.R.T. is a security product used by analysts and SOC teams. Before recommending
or deploying any tool, security professionals should be able to inspect it.

This folder contains honest, plain-language documentation of how S.I.R.T. handles
data, manages secrets, processes information, and is deployed. Everything here is
written for a security-literate audience — no marketing language, no vague claims.

If you find something that concerns you or is missing, open an issue or submit a PR.

---

## Audit Documents

| File | What It Covers |
|---|---|
| [data-privacy.md](./data-privacy.md) | What data S.I.R.T. collects, processes, and retains |
| [api-key-handling.md](./api-key-handling.md) | How LLM API keys are stored, transmitted, and protected |
| [no-data-retention.md](./no-data-retention.md) | Verification that no incident or org data is stored server-side |
| [client-side-processing.md](./client-side-processing.md) | What runs in the browser vs. on the server |
| [dependency-audit.md](./dependency-audit.md) | All npm dependencies with purpose, version, and vulnerability status |
| [deployment-security.md](./deployment-security.md) | Vercel deployment configuration and security posture |
| [skill-bundle-safety.md](./skill-bundle-safety.md) | What the Claude skill bundle does and does not have access to |

---

## Security Contact

Found a vulnerability or security concern?
Open a GitHub issue tagged `security` or contact via the repository.

Do not disclose vulnerabilities publicly before they are addressed.

---

*This audit folder is updated with every version release.*
*Last updated: v1.1 | April 2026*
