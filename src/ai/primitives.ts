import type { AIProvider, ProviderGenerateInput, ProviderGenerateResult } from "./providers/types";
import type { Tool } from "../tools/types";
import type { MemoryStore } from "../memory/memory";
import { openAIProvider } from "../providers/openai";

export type ChatbotConfig = {
  name: string;
  model: string;
  instructions: string;
  provider?: AIProvider;
  memory?: boolean;
};

export type AssistantConfig = ChatbotConfig;

export type WorkflowStepContext = {
  input: string;
  state: Record<string, unknown>;
};

export type WorkflowStep = (ctx: WorkflowStepContext) => Promise<WorkflowStepContext> | WorkflowStepContext;

export type WorkflowConfig = {
  name: string;
  steps: WorkflowStep[];
};

export type AgentConfig = {
  name: string;
  model: string;
  instructions: string;
  provider?: AIProvider;
  tools?: Tool[];
};

export type RuntimeChatbot = {
  name: string;
  run: (input: string) => Promise<string>;
};

export type RuntimeAssistant = RuntimeChatbot;
export type RuntimeAgent = RuntimeChatbot & { tools?: Tool[] };
export type RuntimeWorkflow = {
  name: string;
  run: (input: string) => Promise<Record<string, unknown>>;
};

export function defineChatbot(config: ChatbotConfig): RuntimeChatbot {
  const provider = config.provider ?? openAIProvider;

  return {
    name: config.name,
    async run(input: string) {
      const payload: ProviderGenerateInput = {
        model: config.model,
        instructions: config.instructions,
        input,
      };
      const result: ProviderGenerateResult = await provider.generate(payload);
      return result.text;
    },
  };
}

export function defineAssistant(config: AssistantConfig): RuntimeAssistant {
  return defineChatbot(config);
}

export function defineAgent(config: AgentConfig): RuntimeAgent {
  const bot = defineChatbot(config);
  return { ...bot, tools: config.tools };
}

export function defineWorkflow(config: WorkflowConfig): RuntimeWorkflow {
  return {
    name: config.name,
    async run(input: string) {
      let current: WorkflowStepContext = { input, state: {} };

      for (const step of config.steps) {
        current = await step(current);
      }

      return current.state;
    },
  };
}

export function defineTool(tool: Tool): Tool {
  return tool;
}

export function defineMemory<T extends MemoryStore>(memory: T): T {
  return memory;
}
