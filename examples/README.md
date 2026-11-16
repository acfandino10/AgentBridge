# Examples

Each file runs with `tsx` and does not need a paid API key, except `basic.ts`.

| File | What it shows |
| --- | --- |
| `hello.ts` | Smallest chatbot, using the built-in mock provider |
| `chatbot.ts` | Support chatbot definition |
| `tool-calling-agent.ts` | Agent plus a local tool handler |
| `rag-local.ts` | Retrieval over a tiny in-process vector index, wired as a workflow |
| `workflow.ts` | Multi-step workflow state |
| `basic.ts` | OpenAI agent. Requires `OPENAI_API_KEY` |

```bash
npx tsx examples/hello.ts
npx tsx examples/chatbot.ts
npx tsx examples/tool-calling-agent.ts
npx tsx examples/rag-local.ts
npx tsx examples/workflow.ts
```
