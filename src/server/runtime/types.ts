import type { FeatureModule } from "../../core/feature/types";
import type { PageConfig, RenderMode } from "../../types/rendering";

export type RegisteredRoute = {
  path: string;
  feature: string;
  renderMode: RenderMode;
  pageConfig?: PageConfig;
};

export type RuntimeState = {
  features: FeatureModule[];
  routes: RegisteredRoute[];
};
