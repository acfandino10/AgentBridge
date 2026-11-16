import { FeatureRegistry } from "../../core/feature/registry";
import type { FeatureModule } from "../../core/feature/types";
import type { RenderMode } from "../../types/rendering";
import type { RegisteredRoute, RuntimeState } from "./types";

export class AppRuntime {
  private readonly registry = new FeatureRegistry();
  private readonly routes: RegisteredRoute[] = [];

  registerFeature(feature: FeatureModule): void {
    this.registry.register(feature);

    this.routes.push({
      path: feature.route,
      feature: feature.name,
      renderMode: feature.renderMode ?? "server",
    });
  }

  resolveRenderMode(path: string): RenderMode | undefined {
    return this.routes.find((r) => r.path === path)?.renderMode;
  }

  getState(): RuntimeState {
    return {
      features: this.registry.getAll(),
      routes: [...this.routes],
    };
  }
}
