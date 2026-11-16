export type MemoryMessageRole = "system" | "user" | "assistant";

export type MemoryMessage = {
  role: MemoryMessageRole;
  content: string;
  timestamp: number;
};

export type MemoryStore = {
  add: (message: Omit<MemoryMessage, "timestamp">) => void;
  all: () => MemoryMessage[];
  clear: () => void;
};

export function createInMemoryStore(): MemoryStore {
  const messages: MemoryMessage[] = [];

  return {
    add(message) {
      messages.push({ ...message, timestamp: Date.now() });
    },
    all() {
      return [...messages];
    },
    clear() {
      messages.length = 0;
    },
  };
}
