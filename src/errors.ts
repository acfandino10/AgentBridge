export class MissingApiKeyError extends Error {
  constructor(provider = "OpenAI") {
    super(`Missing ${provider} API key. Set process.env.OPENAI_API_KEY or pass apiKey in server-side config.`);
    this.name = "MissingApiKeyError";
  }
}
