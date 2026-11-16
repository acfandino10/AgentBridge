import { describe, expect, it } from "vitest";
import { runGenerateFeatureCommand } from "../src/cli/commands/generate";
import { AIRegistry } from "../src/ai/registry";
import { defineChatbot, defineTool, defineWorkflow } from "../src/ai/primitives";
import { defineFeature } from "../src/core/feature/defineFeature";
import { FeatureRegistry } from "../src/core/feature/registry";
import { MissingApiKeyError } from "../src/errors";
import { createInMemoryStore } from "../src/memory/memory";
import { mockProvider } from "../src/providers/mock";
import { openAIProvider } from "../src/providers/openai";
import { useChatbot } from "../src/react/hooks";
import { createAIEndpoints } from "../src/server/handlers/aiEndpoints";
import { InMemoryIsrCache } from "../src/server/isr/cache";
import { AppRuntime } from "../src/server/runtime/runtime";

const page = async () => ({ default: () => null });

describe("features and runtime", () => {
  it("rejects a feature that is missing required fields", () => {
    expect(() => defineFeature({ name: "", route: "/", page })).toThrow(/name/);
  });

  it("registers a feature and resolves its render mode", () => {
    const runtime = new AppRuntime();
    runtime.registerFeature(
      defineFeature({
        name: "home",
        route: "/",
        renderMode: "static",
        page,
      })
    );

    expect(runtime.resolveRenderMode("/")).toBe("static");
    expect(runtime.getState().features.map((feature) => feature.name)).toEqual(["home"]);
  });

  it("refuses a duplicate feature name", () => {
    const registry = new FeatureRegistry();
    const feature = defineFeature({ name: "home", route: "/", page });
    registry.register(feature);
    expect(() => registry.register(feature)).toThrow(/already registered/);
  });
});

describe("ISR cache", () => {
  it("treats a fresh entry as fresh and an old entry as stale", () => {
    const cache = new InMemoryIsrCache();
    cache.set("/docs", { html: "<p>docs</p>", generatedAt: Date.now(), revalidate: 60 });
    expect(cache.get("/docs")?.html).toBe("<p>docs</p>");
    expect(cache.isStale("/docs")).toBe(false);

    cache.set("/old", { html: "<p>old</p>", generatedAt: Date.now() - 120_000, revalidate: 60 });
    expect(cache.isStale("/old")).toBe(true);
    expect(cache.isStale("/missing")).toBe(true);
  });
});

describe("AI primitives", () => {
  it("runs a chatbot against the mock provider without a network call", async () => {
    const bot = defineChatbot({
      name: "hello",
      model: "mock",
      instructions: "Reply briefly.",
      provider: mockProvider,
    });

    await expect(bot.run("Hello")).resolves.toBe("mock:mock Reply briefly. Hello");
  });

  it("runs workflow steps in order and returns the final state", async () => {
    const workflow = defineWorkflow({
      name: "upper",
      steps: [
        (ctx) => ({ ...ctx, state: { ...ctx.state, original: ctx.input } }),
        (ctx) => ({ ...ctx, state: { ...ctx.state, answer: ctx.input.toUpperCase() } }),
      ],
    });

    await expect(workflow.run("hello")).resolves.toEqual({ original: "hello", answer: "HELLO" });
  });

  it("exposes registered chatbots through endpoint handlers", async () => {
    const registry = new AIRegistry();
    registry.registerChatbot(
      defineChatbot({
        name: "support",
        model: "mock",
        instructions: "Help.",
        provider: mockProvider,
      })
    );

    const endpoints = createAIEndpoints(registry);
    const support = endpoints.chat.support;
    const missing = endpoints.chat.missing;
    if (!support || !missing) throw new Error("Expected chat handlers from the endpoint proxy.");

    await expect(support({ input: "ping" })).resolves.toEqual({
      output: "mock:mock Help. ping",
    });
    await expect(missing({ input: "ping" })).rejects.toThrow(/not registered/);
  });

  it("invokes a tool handler with the arguments it was given", async () => {
    const lookup = defineTool({
      definition: {
        name: "lookup",
        description: "Look up a topic",
        parameters: { topic: { type: "string", required: true } },
      },
      handler(args) {
        return `found:${String(args.topic)}`;
      },
    });

    await expect(lookup.handler({ topic: "routes" }, { agentInstructions: "Use tools." })).toBe("found:routes");
  });

  it("stores and clears memory messages", () => {
    const memory = createInMemoryStore();
    memory.add({ role: "user", content: "hi" });
    expect(memory.all()).toHaveLength(1);
    expect(memory.all()[0]?.content).toBe("hi");
    memory.clear();
    expect(memory.all()).toEqual([]);
  });

  it("requires an API key before calling OpenAI", () => {
    const previous = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    try {
      expect(() => openAIProvider.validateConfig({})).toThrow(MissingApiKeyError);
    } finally {
      if (previous === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = previous;
    }
  });
});

describe("react session helper", () => {
  it("posts chat input to the chatbot endpoint", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ output: "pong" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as typeof fetch;

    try {
      const chat = useChatbot("support");
      await expect(chat.send("ping")).resolves.toBe("pong");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

describe("cli", () => {
  it("prints the generated feature name", async () => {
    let output = "";
    const write = process.stdout.write.bind(process.stdout);
    process.stdout.write = ((chunk: string | Uint8Array) => {
      output += String(chunk);
      return true;
    }) as typeof process.stdout.write;

    try {
      await runGenerateFeatureCommand(["auth"]);
    } finally {
      process.stdout.write = write as typeof process.stdout.write;
    }

    expect(output).toContain("Feature: auth");
  });
});
