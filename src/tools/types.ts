export type ToolParameterType = "string" | "number" | "boolean" | "object" | "array";

export type ToolParameter = {
  type: ToolParameterType;
  description?: string;
  required?: boolean;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters?: Record<string, ToolParameter>;
};

export type ToolContext = {
  agentInstructions: string;
};

export type ToolHandler = (args: Record<string, unknown>, context: ToolContext) => Promise<unknown> | unknown;

export type Tool = {
  definition: ToolDefinition;
  handler: ToolHandler;
};
