import { createAgent } from "../src";

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Set OPENAI_API_KEY in .env to run this example. For an offline run, use examples/hello.ts.");
    process.exitCode = 1;
    return;
  }

  const agent = createAgent({
    provider: "openai",
    model: "gpt-4o-mini",
    instructions: "You are a friendly coding mentor.",
  });

  const response = await agent.run("What is TypeScript?");
  console.log(response);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
