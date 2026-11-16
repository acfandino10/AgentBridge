export async function runDevCommand(_args: string[]): Promise<void> {
  process.stdout.write(
    [
      "[MVP] dev command invoked.",
      "Local development orchestration will be added in a later iteration.",
      "",
    ].join("\n")
  );
}
