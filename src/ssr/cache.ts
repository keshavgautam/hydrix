interface CacheEntry {
  html: string;
  expiresAt: number | null; // null = never expires
}

class SSRCache {
  private store = new Map<string, CacheEntry>();

  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.html;
  }

  set(key: string, html: string, ttlMs?: number): void {
    this.store.set(key, {
      html,
      expiresAt: ttlMs != null ? Date.now() + ttlMs : null,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateAll(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

export const ssrCache = new SSRCache();
