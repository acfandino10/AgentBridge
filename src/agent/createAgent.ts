import { runOpenAI } from "../providers/openai";
import type { Agent, AgentConfig } from "./types";

export function createAgent(config: AgentConfig): Agent {
  return {
    async run(input: string) {
      if (config.provider === "openai") {
        return runOpenAI(config, input);
      }

      throw new Error(`Unsupported provider: ${String(config.provider)}`);
    },
  };
}
