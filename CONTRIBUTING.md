# Contributing

Thanks for helping improve AgentBridge. This project is an early TypeScript framework, and small, focused pull requests are the most useful kind.

## Local setup

Requirements: Node.js 22 or 24 for development. The published package itself runs on Node.js 18 or newer.

```bash
npm install
cp .env.example .env
```

`.env` is optional. The test suite and the examples other than `examples/basic.ts` use the built-in mock provider and do not call OpenAI.

## Checks

Run these before opening a pull request. CI runs the same commands.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run dev` runs the offline hello-world example.

## Code style

- TypeScript, strict mode, with the existing semicolon and double-quote style.
- Keep provider calls behind `AIProvider`. Do not hardcode API keys, internal URLs, or private service clients.
- New behavior needs a test in `tests/` that passes without network access or paid credentials.
- React components live in `src/react` and are published from `agent-bridge/react`. Keep the core entry free of a React import.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Describe the user-facing change in the pull request.
3. Link a related issue when one exists.
4. Keep the diff limited to that change.

## Good first issues

Starter tasks are listed in [docs/good-first-issues.md](docs/good-first-issues.md). After the repository is public, open those as GitHub issues and add the `good first issue` label.

Suggested labels: `bug`, `enhancement`, `documentation`, `good first issue`.

## Reporting security issues

See [SECURITY.md](SECURITY.md). Do not open a public issue for a leaked credential.

## Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
