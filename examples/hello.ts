import { defineChatbot, mockProvider } from "../src";

async function main() {
  const bot = defineChatbot({
    name: "hello",
    model: "mock",
    instructions: "Reply briefly.",
    provider: mockProvider,
  });

  console.log(await bot.run("Hello"));
}

main();
