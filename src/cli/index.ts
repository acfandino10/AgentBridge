#!/usr/bin/env node

import { runCreateCommand } from "./commands/create";
import { runDevCommand } from "./commands/dev";
import { runBuildCommand } from "./commands/build";
import { runStartCommand } from "./commands/start";
import {
  runGenerateFeatureCommand,
  runGenerateChatbotCommand,
  runGenerateWorkflowCommand,
} from "./commands/generate";

type CLICommandHandler = (args: string[]) => Promise<void> | void;

type CommandMap = Record<string, CLICommandHandler>;

const commands: CommandMap = {
  create: runCreateCommand,
  dev: runDevCommand,
  build: runBuildCommand,
  start: runStartCommand,
};

function printHelp(): void {
  process.stdout.write(
    [
      "agent-bridge CLI",
      "",
      "Usage:",
      "  agent-bridge <command> [args]",
      "",
      "Commands:",
      "  create                     Scaffold a new app project (MVP stub)",
      "  dev                        Start local development mode (MVP stub)",
      "  build                      Build the app (MVP stub)",
      "  start                      Start production server (MVP stub)",
      "  generate feature <name>    Generate a feature scaffold (MVP stub)",
      "  generate chatbot <name>    Generate a chatbot scaffold (MVP stub)",
      "  generate workflow <name>   Generate a workflow scaffold (MVP stub)",
      "",
    ].join("\n")
  );
}

async function run(): Promise<void> {
  const [, , rawCommand, ...rest] = process.argv;

  if (!rawCommand || rawCommand === "--help" || rawCommand === "-h") {
    printHelp();
    return;
  }

  if (rawCommand === "generate") {
    const [kind, ...args] = rest;

    if (kind === "feature") {
      await runGenerateFeatureCommand(args);
      return;
    }

    if (kind === "chatbot") {
      await runGenerateChatbotCommand(args);
      return;
    }

    if (kind === "workflow") {
      await runGenerateWorkflowCommand(args);
      return;
    }

    process.stderr.write('Unknown generate target. Use "feature", "chatbot", or "workflow".\n');
    process.exitCode = 1;
    return;
  }

  const command = commands[rawCommand];
  if (!command) {
    process.stderr.write(`Unknown command: ${rawCommand}\n\n`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  await command(rest);
}

void run();
