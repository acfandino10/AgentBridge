# AgentBridge Documentation

This document explains how to use **agent-bridge** in its current MVP state.

## What this framework provides

- TypeScript-first primitives for AI app architecture
- Feature-driven route modules and runtime composition
- Explicit render modes (`server`, `client`, `static`, `incremental`, `hybrid`)
- AI abstractions (chatbot, assistant, agent, workflow, tools, memory)
- Provider abstraction and OpenAI provider wiring
- React-facing hooks/components (MVP scaffolds)
- CLI command surface for app lifecycle and generation (MVP scaffolds)

---

## Installation

```bash
npm install agent-bridge
```

For local development of this repo:

```bash
npm install
cp .env.example .env
npm test
npm run build
```

---

## Environment setup

Copy `.env.example` to `.env` when you want to call OpenAI:

```
OPENAI_API_KEY=your_key_here
```

You can also pass `apiKey` directly to provider/agent configs.
If no key is found in config or env, the OpenAI provider throws `MissingApiKeyError`.

For tests and local demos, pass `mockProvider` instead. It returns deterministic text and does not read a key or make a network call.

```ts
import { defineChatbot, mockProvider } from "agent-bridge";

async function main() {
  const bot = defineChatbot({
    name: "hello",
    model: "mock",
    instructions: "Reply briefly.",
    provider: mockProvider,
  });

  console.log(await bot.run("Hello"));
}

main();
```

---

## Public API surface

The package exports from `src/index.ts` include:

- Rendering types: `src/types/rendering`
- Feature system: `src/core/feature/*`
- Runtime/server primitives: `src/server/runtime/*`, `src/server/isr/cache`, `src/server/handlers/aiEndpoints`
- Errors: `src/errors`
- AI: `src/ai/providers/types`, `src/ai/primitives`, `src/ai/registry`
- Agent creation: `src/agent/createAgent`
- OpenAI provider: `src/providers/openai`
- Tool/memory contracts: `src/tools/types`, `src/memory/memory`
- Mock provider: `src/providers/mock` (exported from the package root)
- React APIs: `src/react/hooks`, `src/react/components`, published as `agent-bridge/react`

---

## Rendering modes

Use these modes in route/page configuration:

- `server`
- `client`
- `static`
- `incremental`
- `hybrid`

These are defined in `src/types/rendering.ts` and consumed by feature + runtime APIs.

---

## Feature modules

Define features with metadata + route behavior.

```ts
import { defineFeature } from "agent-bridge";

const homeFeature = defineFeature({
  name: "home",
  route: "/",
  renderMode: "server",
  page: async () => ({ default: () => null }),
});
```

Key fields:

- `name`: unique feature name
- `route`: route path
- `page`: page loader
- optional `server`, `ai`, `renderMode`

You can manage features via `FeatureRegistry`.

---

## Runtime composition

Use `AppRuntime` to register features/routes and resolve render behavior.

```ts
import { AppRuntime, defineFeature } from "agent-bridge";

const runtime = new AppRuntime();

runtime.registerFeature(
  defineFeature({
    name: "dashboard",
    route: "/dashboard",
    renderMode: "server",
    page: async () => ({ default: () => null }),
  })
);

const mode = runtime.resolveRenderMode("/dashboard");
console.log(mode); // "server"

const snapshot = runtime.getState();
console.log(snapshot.features, snapshot.routes);
```

---

## ISR cache (MVP in-memory)

Use `InMemoryIsrCache` (`src/server/isr/cache.ts`) for incremental/static workflows in memory:

- `get`
- `set`
- stale detection using `generatedAt` and `revalidate`

This is a scaffold cache useful for local runtime behavior and extension.

---

## AI primitives

`src/ai/primitives.ts` includes:

- `defineChatbot`
- `defineAssistant`
- `defineAgent`
- `defineWorkflow`
- `defineTool`
- `defineMemory`

Example chatbot:

```ts
import { defineChatbot } from "agent-bridge";

const supportBot = defineChatbot({
  name: "support",
  model: "gpt-4o-mini",
  instructions: "You are a helpful support assistant.",
});

const output = await supportBot.run("How can I reset my password?");
console.log(output);
```

---

## Agent quick-start

This mirrors `examples/basic.ts`:

```ts
import { createAgent } from "agent-bridge";

async function main() {
  const agent = createAgent({
    provider: "openai",
    model: "gpt-4o-mini",
    instructions: "You are a friendly coding mentor.",
    // apiKey: "sk-..." // optional if OPENAI_API_KEY is set
  });

  const response = await agent.run("What is TypeScript?");
  console.log(response);
}

main().catch(console.error);
```

---

## Provider abstraction

Provider contracts are in `src/ai/providers/types.ts`:

- `validateConfig`
- `generate`
- `stream`
- `toolCall`
- `defineProvider()`

OpenAI provider is in `src/providers/openai.ts` with API key fallback order:

1. explicit `apiKey`
2. `process.env.OPENAI_API_KEY`

---

## AI endpoint handler registration

`createAIEndpoints()` (`src/server/handlers/aiEndpoints.ts`) maps registry entries to:

- `/api/ai/chat/:name`
- `/api/ai/agent/:name`
- `/api/ai/workflow/:name`

Use this as your server integration contract when wiring HTTP endpoints to framework AI definitions.

---

## React integration (MVP)

Import React helpers from the React entry so the core package stays free of a React dependency:

```ts
import { Chatbot, useChatbot } from "agent-bridge/react";
```

Hooks (`src/react/hooks.ts`):

- `useChatbot`
- `useAssistant`
- `useAgent`
- `useWorkflow`
- `useAIStream`

Components (`src/react/components.tsx`):

- `Chatbot`
- `ChatMessage`
- `ChatInput`
- `StreamingMessage`

These are scaffold primitives for integrating conversational UI and streaming UX in React apps.

---

## CLI usage (MVP)

CLI entry: `src/cli/index.ts`

### Available commands

- `create`
- `dev`
- `build`
- `start`
- `generate feature <name>`
- `generate chatbot <name>`
- `generate workflow <name>`

### Run locally in this repo

```bash
npm run cli -- --help
npm run cli -- create my-agent-bridge
npm run cli -- dev
npm run cli -- build
npm run cli -- start
npm run cli -- generate feature auth
npm run cli -- generate chatbot support
npm run cli -- generate workflow onboarding
```

Current command behavior is scaffold-level (stub outputs), designed for expansion into full generators/runtime wiring.

---

## Typical adoption flow

1. Install package and configure API keys
2. Define features with routes/render modes
3. Register features into `AppRuntime`
4. Define AI primitives (chatbot/agent/workflow)
5. Wire provider (OpenAI or custom provider contract)
6. Expose AI endpoints with `createAIEndpoints()`
7. Integrate UI with React hooks/components
8. Use CLI scaffolds to standardize project lifecycle

---

## Notes on current MVP status

- Core architecture and contracts are in place
- CLI and some UI/runtime pieces are intentionally scaffold-level
- API shapes are designed for iterative extension without breaking architecture boundaries
- `mockProvider` covers offline tests and the examples in `examples/`
- React components are exported from `agent-bridge/react`
