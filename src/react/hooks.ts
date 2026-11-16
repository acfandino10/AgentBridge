export type ChatSession = {
  send: (message: string) => Promise<string>;
};

async function postJSON(url: string, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function useChatbot(name: string): ChatSession {
  return {
    async send(message: string) {
      const result = (await postJSON(`/api/ai/chat/${name}`, { input: message })) as { output?: string };
      return result.output ?? "";
    },
  };
}

export function useAssistant(name: string): ChatSession {
  return useChatbot(name);
}

export function useAgent(name: string): ChatSession {
  return {
    async send(message: string) {
      const result = (await postJSON(`/api/ai/agent/${name}`, { input: message })) as { output?: string };
      return result.output ?? "";
    },
  };
}

export function useWorkflow(name: string): ChatSession {
  return {
    async send(message: string) {
      const result = (await postJSON(`/api/ai/workflow/${name}`, { input: message })) as { output?: string };
      return result.output ?? "";
    },
  };
}

export function useAIStream(name: string): ChatSession {
  return useChatbot(name);
}
