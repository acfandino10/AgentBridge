function ensureName(args: string[], target: "feature" | "chatbot" | "workflow"): string {
  const [name] = args;
  if (!name) {
    throw new Error(`Missing ${target} name. Usage: agent-bridge generate ${target} <name>`);
  }
  return name;
}

export async function runGenerateFeatureCommand(args: string[]): Promise<void> {
  const name = ensureName(args, "feature");
  process.stdout.write(
    [
      `[MVP] generate feature command invoked.`,
      `Feature: ${name}`,
      "Feature file templates will be added in a later iteration.",
      "",
    ].join("\n")
  );
}

export async function runGenerateChatbotCommand(args: string[]): Promise<void> {
  const name = ensureName(args, "chatbot");
  process.stdout.write(
    [
      `[MVP] generate chatbot command invoked.`,
      `Chatbot: ${name}`,
      "Chatbot templates will be added in a later iteration.",
      "",
    ].join("\n")
  );
}

export async function runGenerateWorkflowCommand(args: string[]): Promise<void> {
  const name = ensureName(args, "workflow");
  process.stdout.write(
    [
      `[MVP] generate workflow command invoked.`,
      `Workflow: ${name}`,
      "Workflow templates will be added in a later iteration.",
      "",
    ].join("\n")
  );
}
