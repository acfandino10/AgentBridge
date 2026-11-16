import type { RenderMode } from "../../types/rendering";

export type FeatureLoader<T = unknown> = () => Promise<T>;

export type FeatureDefinition = {
  name: string;
  route: string;
  page: FeatureLoader;
  server?: FeatureLoader;
  ai?: FeatureLoader;
  renderMode?: RenderMode;
};

export type FeatureModule = FeatureDefinition;
