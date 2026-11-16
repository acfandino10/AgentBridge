import "dotenv/config";
import { MissingApiKeyError } from "../errors";
import { defineProvider } from "../ai/providers/types";
import type {
  AIProvider,
  ProviderGenerateInput,
  ProviderGenerateResult,
  ProviderStreamChunk,
  ProviderToolCallInput,
} from "../ai/providers/types";

function readEnvVar(name: string): string | undefined {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name] === "string"
  ) {
    return (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[name];
  }

  return undefined;
}

type OpenAIResponsesApiOutputItem = {
  type?: string;
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

type OpenAIResponsesApiResult = {
  output_text?: string;
  output?: OpenAIResponsesApiOutputItem[];
};

function extractText(data: OpenAIResponsesApiResult): string {
  if (typeof data.output_text === "string" && data.output_text.trim().length > 0) {
    return data.output_text;
  }

  if (Array.isArray(data.output)) {
    const joined = data.output
      .flatMap((item) => item.content ?? [])
      .filter((c) => c.type === "output_text" || typeof c.text === "string")
      .map((c) => c.text ?? "")
      .join("")
      .trim();

    if (joined.length > 0) return joined;
  }

  return "";
}

async function openAIRequest(input: ProviderGenerateInput): Promise<ProviderGenerateResult> {
  const envApiKey = readEnvVar("OPENAI_API_KEY");
  const apiKey = input.apiKey || envApiKey;

  if (!apiKey) {
    throw new MissingApiKeyError("OpenAI");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: input.model,
      input: input.instructions ? `${input.instructions}\n\nUser: ${input.input}` : input.input,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`OpenAI request failed: ${response.status} ${response.statusText} ${errorBody}`);
  }

  const data = (await response.json()) as OpenAIResponsesApiResult;
  const text = extractText(data);

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return { text };
}

async function* openAIStream(input: ProviderGenerateInput): AsyncIterable<ProviderStreamChunk> {
  const result = await openAIRequest(input);
  yield { text: result.text, done: true };
}

async function openAIToolCall(input: ProviderToolCallInput): Promise<unknown> {
  return {
    provider: "openai",
    toolName: input.toolName,
    args: input.args,
    note: "MVP toolCall stub. Integrate native function/tool calling in next iteration.",
  };
}

export const openAIProvider: AIProvider = defineProvider({
  name: "openai",
  validateConfig(config) {
    if (!config.apiKey && !readEnvVar("OPENAI_API_KEY")) {
      throw new MissingApiKeyError("OpenAI");
    }
  },
  generate: openAIRequest,
  stream: openAIStream,
  toolCall: openAIToolCall,
});

export async function runOpenAI(config: { model: string; instructions: string; apiKey?: string }, input: string): Promise<string> {
  const result = await openAIProvider.generate({
    model: config.model,
    instructions: config.instructions,
    input,
    apiKey: config.apiKey,
  });
  return result.text;
}
