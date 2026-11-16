export type RenderMode = "server" | "client" | "static" | "incremental" | "hybrid";

export type PageConfig = {
  renderMode: RenderMode;
  revalidate?: number;
};

export type TransportMode = "http" | "stream" | "sse" | "websocket";
