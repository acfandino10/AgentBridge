export type AgentProvider = "openai";

export type AgentConfig = {
  provider: AgentProvider;
  model: string;
  instructions: string;
  apiKey?: string;
};

export type Agent = {
  run: (input: string) => Promise<string>;
};
