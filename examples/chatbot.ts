import { defineChatbot, mockProvider } from "../src";

async function main() {
  const support = defineChatbot({
    name: "support",
    model: "mock",
    instructions: "You are a helpful support assistant.",
    provider: mockProvider,
  });

  const reply = await support.run("How do I reset my password?");
  console.log(reply);
}

main();
