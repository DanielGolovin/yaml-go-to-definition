interface ICache {
  get(key: string): any;
  set(key: string, value: any): void;
}

export class Cache<T> implements ICache {
  private cache: { [key: string]: { timestamp: number; value: T } } = {};
  private cacheLifetimeMs: number;

  constructor(cacheLifetimeMs: number) {
    this.cacheLifetimeMs = cacheLifetimeMs;
  }

  get(key: string): T | undefined {
    const cachedResult = this.cache[key];
    const now = Date.now();

    if (cachedResult && now - cachedResult.timestamp < this.cacheLifetimeMs) {
      cachedResult.timestamp = now;
      return cachedResult.value;
    }

    delete this.cache[key];

    return undefined;
  }

  set(key: string, value: T): void {
    const now = Date.now();
    this.cache[key] = {
      timestamp: now,
      value: value,
    };
  }
}
