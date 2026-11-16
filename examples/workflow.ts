import { defineWorkflow } from "../src";

const onboarding = defineWorkflow({
  name: "onboarding",
  steps: [
    (ctx) => ({ ...ctx, state: { name: ctx.input.trim() } }),
    (ctx) => ({
      ...ctx,
      state: { ...ctx.state, greeting: `Welcome, ${String(ctx.state.name)}.` },
    }),
  ],
});

async function main() {
  const result = await onboarding.run("Ada");
  console.log(result);
}

main();
