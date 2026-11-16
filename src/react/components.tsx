import { useState } from "react";
import { useChatbot } from "./hooks";

export type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div data-role={role} style={{ padding: "8px 0" }}>
      <strong>{role}:</strong> {content}
    </div>
  );
}

export type ChatInputProps = {
  onSend: (message: string) => Promise<void> | void;
};

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const message = value.trim();
        if (!message) return;
        await onSend(message);
        setValue("");
      }}
    >
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  );
}

export type StreamingMessageProps = {
  content: string;
};

export function StreamingMessage({ content }: StreamingMessageProps) {
  return <div aria-live="polite">{content}</div>;
}

export type ChatbotProps = {
  name: string;
};

export function Chatbot({ name }: ChatbotProps) {
  const chat = useChatbot(name);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
      </div>
      <ChatInput
        onSend={async (message) => {
          setMessages((prev) => [...prev, { role: "user", content: message }]);
          const reply = await chat.send(message);
          setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        }}
      />
    </div>
  );
}
