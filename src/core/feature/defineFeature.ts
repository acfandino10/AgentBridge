import type { FeatureDefinition, FeatureModule } from "./types";

export function defineFeature(definition: FeatureDefinition): FeatureModule {
  if (!definition.name || !definition.route || !definition.page) {
    throw new Error("Invalid feature definition. `name`, `route`, and `page` are required.");
  }

  return definition;
}
