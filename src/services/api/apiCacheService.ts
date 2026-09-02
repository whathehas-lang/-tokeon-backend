interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export class ApiCacheService {
  private prefix = 'sports_v4_cache_';
  private defaultTtlMs = 5 * 60 * 1000; // 5분 (300,000ms)

  public get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);
      const now = Date.now();

      if (now - entry.timestamp > entry.ttlMs) {
        // Expired
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      console.log(`[ApiCacheService] Cache HIT for key: ${key}`);
      return entry.data;
    } catch (e) {
      console.warn(`[ApiCacheService] Failed to read cache key ${key}:`, e);
      return null;
    }
  }

  public set<T>(key: string, data: T, ttlMs?: number): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttlMs: ttlMs || this.defaultTtlMs
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
      console.log(`[ApiCacheService] Cache SET for key: ${key}`);
    } catch (e) {
      console.warn(`[ApiCacheService] Failed to set cache key ${key}:`, e);
    }
  }

  public clearAll(): void {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(this.prefix)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.warn('[ApiCacheService] Failed to clear cache:', e);
    }
  }
}

export const apiCacheService = new ApiCacheService();
