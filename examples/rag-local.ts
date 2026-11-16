import { defineTool, defineWorkflow } from "../src";

type Doc = { id: string; text: string };

const corpus: Doc[] = [
  { id: "render", text: "Render modes are server, client, static, incremental, and hybrid." },
  { id: "agent", text: "Agents are created with defineAgent and can carry tools." },
  { id: "memory", text: "Memory stores chat messages with add, all, and clear." },
];

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function embed(text: string): Map<string, number> {
  const vector = new Map<string, number>();
  for (const token of tokenize(text)) {
    vector.set(token, (vector.get(token) ?? 0) + 1);
  }
  return vector;
}

function cosine(left: Map<string, number>, right: Map<string, number>): number {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (const value of left.values()) leftMagnitude += value * value;
  for (const value of right.values()) rightMagnitude += value * value;
  for (const [token, value] of left) dot += value * (right.get(token) ?? 0);

  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function search(query: string, limit = 2): Doc[] {
  const queryVector = embed(query);
  return corpus
    .map((doc) => ({ doc, score: cosine(queryVector, embed(doc.text)) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((hit) => hit.doc);
}

const retrieve = defineTool({
  definition: {
    name: "retrieve",
    description: "Retrieve the closest local documents for a question.",
    parameters: { query: { type: "string", required: true } },
  },
  handler(args) {
    return search(String(args.query ?? ""));
  },
});

const rag = defineWorkflow({
  name: "local-rag",
  steps: [
    async (ctx) => {
      const passages = await retrieve.handler({ query: ctx.input }, { agentInstructions: "Retrieve local docs." });
      return { ...ctx, state: { question: ctx.input, passages } };
    },
  ],
});

async function main() {
  const result = await rag.run("How do I render a page?");
  console.log(result);
}

main();
