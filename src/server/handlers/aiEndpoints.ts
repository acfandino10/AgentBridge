import type { AIRegistry } from "../../ai/registry";

export type AIEndpointHandler = (body: { input: string }) => Promise<unknown>;

export type RegisteredAIEndpoints = {
  chat: Record<string, AIEndpointHandler>;
  agent: Record<string, AIEndpointHandler>;
  workflow: Record<string, AIEndpointHandler>;
};

export function createAIEndpoints(registry: AIRegistry): RegisteredAIEndpoints {
  return {
    chat: new Proxy(
      {},
      {
        get(_, name: string) {
          return async (body: { input: string }) => {
            const bot = registry.getChatbot(name);
            if (!bot) throw new Error(`Chatbot "${name}" is not registered.`);
            return { output: await bot.run(body.input) };
          };
        },
      }
    ) as Record<string, AIEndpointHandler>,

    agent: new Proxy(
      {},
      {
        get(_, name: string) {
          return async (body: { input: string }) => {
            const agent = registry.getAgent(name);
            if (!agent) throw new Error(`Agent "${name}" is not registered.`);
            return { output: await agent.run(body.input) };
          };
        },
      }
    ) as Record<string, AIEndpointHandler>,

    workflow: new Proxy(
      {},
      {
        get(_, name: string) {
          return async (body: { input: string }) => {
            const workflow = registry.getWorkflow(name);
            if (!workflow) throw new Error(`Workflow "${name}" is not registered.`);
            return { output: await workflow.run(body.input) };
          };
        },
      }
    ) as Record<string, AIEndpointHandler>,
  };
}
