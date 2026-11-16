# Community launch

The repository files for a public release are in place. These steps need your accounts, so they are not done from this working tree.

## Before the first push

1. Revoke the OpenAI key that was stored in `.env` and create a new one. Put the new key only in `.env`.
2. Create a GitHub organization for the project, then create an empty repository under that organization.
3. Initialize git here if you have not already, commit, and push to that repository.
4. In the repository settings, switch visibility to public only after you confirm `.env` is not in the tree (`git status` should not list it).
5. Enable GitHub Discussions for questions.
6. Create labels: `bug`, `enhancement`, `documentation`, `good first issue`.
7. Open the tasks in [docs/good-first-issues.md](docs/good-first-issues.md) as issues.

## Package registry

The package is set up for npm. From a clean checkout, after `npm login`:

```bash
npm publish
```

`prepublishOnly` runs lint, typecheck, tests, and the build. Confirm the name `agent-bridge` is available first. If it is taken, publish under the organization scope and set `"name"` to that scope.

Users install it with:

```bash
npm install agent-bridge
```

## Channels and launch

- Add a real contact in the README and in `CODE_OF_CONDUCT.md` once you have a maintainer email or a Discussions link.
- Open a Discord server when you want a live support channel, and link it from the README.
- Record a one-minute demo of `npx tsx examples/hello.ts`, then the tool-calling and local RAG examples. Those three show an offline agent, a tool, and retrieval without an API key.
- Share that demo when you are ready: Hacker News (`Show HN`), X, Reddit (`r/LocalLLaMA`, `r/MachineLearning`), and the Discord communities you already participate in.
