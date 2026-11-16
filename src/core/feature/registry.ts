import type { FeatureModule } from "./types";

export class FeatureRegistry {
  private readonly modules = new Map<string, FeatureModule>();

  register(module: FeatureModule): void {
    if (this.modules.has(module.name)) {
      throw new Error(`Feature "${module.name}" is already registered.`);
    }

    this.modules.set(module.name, module);
  }

  getByName(name: string): FeatureModule | undefined {
    return this.modules.get(name);
  }

  getAll(): FeatureModule[] {
    return Array.from(this.modules.values());
  }
}
