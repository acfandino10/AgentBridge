export type IsrCacheEntry = {
  html: string;
  generatedAt: number;
  revalidate: number;
};

export class InMemoryIsrCache {
  private readonly cache = new Map<string, IsrCacheEntry>();

  get(path: string): IsrCacheEntry | undefined {
    return this.cache.get(path);
  }

  set(path: string, entry: IsrCacheEntry): void {
    this.cache.set(path, entry);
  }

  isStale(path: string): boolean {
    const entry = this.cache.get(path);
    if (!entry) return true;

    const ageSeconds = (Date.now() - entry.generatedAt) / 1000;
    return ageSeconds >= entry.revalidate;
  }
}
