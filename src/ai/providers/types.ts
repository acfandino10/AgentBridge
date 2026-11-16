export type ProviderGenerateInput = {
  model: string;
  instructions?: string;
  input: string;
  apiKey?: string;
};

export type ProviderGenerateResult = {
  text: string;
};

export type ProviderStreamChunk = {
  text: string;
  done?: boolean;
};

export type ProviderToolCallInput = {
  model: string;
  toolName: string;
  args: Record<string, unknown>;
  apiKey?: string;
};

export type ProviderConfig = {
  apiKey?: string;
};

export type AIProvider = {
  name: string;
  validateConfig: (config: ProviderConfig) => void;
  generate: (input: ProviderGenerateInput) => Promise<ProviderGenerateResult>;
  stream: (input: ProviderGenerateInput) => AsyncIterable<ProviderStreamChunk>;
  toolCall: (input: ProviderToolCallInput) => Promise<unknown>;
};

export function defineProvider(provider: AIProvider): AIProvider {
  return provider;
}
