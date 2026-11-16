import type { RuntimeAgent, RuntimeChatbot, RuntimeWorkflow } from "./primitives";

export class AIRegistry {
  private readonly chatbots = new Map<string, RuntimeChatbot>();
  private readonly agents = new Map<string, RuntimeAgent>();
  private readonly workflows = new Map<string, RuntimeWorkflow>();

  registerChatbot(bot: RuntimeChatbot): void {
    this.chatbots.set(bot.name, bot);
  }

  registerAgent(agent: RuntimeAgent): void {
    this.agents.set(agent.name, agent);
  }

  registerWorkflow(workflow: RuntimeWorkflow): void {
    this.workflows.set(workflow.name, workflow);
  }

  getChatbot(name: string): RuntimeChatbot | undefined {
    return this.chatbots.get(name);
  }

  getAgent(name: string): RuntimeAgent | undefined {
    return this.agents.get(name);
  }

  getWorkflow(name: string): RuntimeWorkflow | undefined {
    return this.workflows.get(name);
  }
}
