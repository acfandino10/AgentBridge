export async function runBuildCommand(_args: string[]): Promise<void> {
  process.stdout.write(
    [
      "[MVP] build command invoked.",
      "Production build pipeline wiring will be added in a later iteration.",
      "",
    ].join("\n")
  );
}
