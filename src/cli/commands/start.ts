export async function runStartCommand(_args: string[]): Promise<void> {
  process.stdout.write(
    [
      "[MVP] start command invoked.",
      "Production server startup wiring will be added in a later iteration.",
      "",
    ].join("\n")
  );
}
