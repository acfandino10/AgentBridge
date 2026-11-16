export async function runCreateCommand(args: string[]): Promise<void> {
  const [name] = args;
  const projectName = name ?? "my-agent-bridge";

  process.stdout.write(
    [
      `[MVP] create command invoked.`,
      `Project: ${projectName}`,
      "Scaffolding templates will be added in a later iteration.",
      "",
    ].join("\n")
  );
}
