import { defineProvider } from "../ai/providers/types";
import type { AIProvider, ProviderGenerateInput, ProviderGenerateResult, ProviderStreamChunk } from "../ai/providers/types";

function mockText(input: ProviderGenerateInput): string {
  const instructions = input.instructions ? `${input.instructions} ` : "";
  return `mock:${input.model} ${instructions}${input.input}`.trim();
}

/**
 * Deterministic provider for tests, examples, and offline development.
 * It never reads API keys or calls a network.
 */
export const mockProvider: AIProvider = defineProvider({
  name: "mock",
  validateConfig() {
    return undefined;
  },
  async generate(input): Promise<ProviderGenerateResult> {
    return { text: mockText(input) };
  },
  async *stream(input): AsyncIterable<ProviderStreamChunk> {
    yield { text: mockText(input), done: true };
  },
  async toolCall(input) {
    return {
      provider: "mock",
      toolName: input.toolName,
      args: input.args,
    };
  },
});
