import { defineAgent, defineTool, mockProvider } from "../src";

const docs: Record<string, string> = {
  "render modes": "server, client, static, incremental, and hybrid.",
  memory: "An in-memory store with add, all, and clear.",
};

const lookupDocs = defineTool({
  definition: {
    name: "lookup_docs",
    description: "Look up a short note about this framework.",
    parameters: {
      topic: { type: "string", description: "Topic name", required: true },
    },
  },
  handler(args) {
    const topic = String(args.topic ?? "").toLowerCase();
    return docs[topic] ?? `No note for "${topic}".`;
  },
});

const agent = defineAgent({
  name: "docs-agent",
  model: "mock",
  instructions: "Answer with the tool result.",
  provider: mockProvider,
  tools: [lookupDocs],
});

async function main() {
  const topic = "render modes";
  const tool = agent.tools?.find((item) => item.definition.name === "lookup_docs");
  const note = await tool?.handler({ topic }, { agentInstructions: "Answer with the tool result." });
  const reply = await agent.run(`Question: What are the ${topic}?\nTool result: ${String(note)}`);

  console.log({ note, reply });
}

main();
