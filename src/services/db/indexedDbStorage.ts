import type { VerifiedMatchEntity, VerificationAuditReport } from '../verification/types';

const DB_NAME = 'tokeon_verified_db';
const DB_VERSION = 2;
const STORE_MATCHES = 'verified_matches';
const STORE_AUDITS = 'audit_reports';
const STORE_H2H = 'h2h_records';

export class IndexedDbStorage {
  private db: IDBDatabase | null = null;
  private isAvailable: boolean = typeof window !== 'undefined' && 'indexedDB' in window;

  /**
   * Initialize IndexedDB instance safely.
   */
  public async init(): Promise<boolean> {
    if (!this.isAvailable) return false;
    if (this.db) return true;

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;

          // Object store for verified matches
          if (!db.objectStoreNames.contains(STORE_MATCHES)) {
            const matchStore = db.createObjectStore(STORE_MATCHES, { keyPath: 'match.id' });
            matchStore.createIndex('sport', 'match.sport', { unique: false });
            matchStore.createIndex('betmanFolder', 'match.betmanFolder', { unique: false });
            matchStore.createIndex('betmanRound', 'match.betmanRound', { unique: false });
            matchStore.createIndex('betmanMatchNo', 'match.betmanMatchNo', { unique: false });
            matchStore.createIndex('verifiedAt', 'audit.verifiedAt', { unique: false });
          }

          // Object store for audit reports
          if (!db.objectStoreNames.contains(STORE_AUDITS)) {
            db.createObjectStore(STORE_AUDITS, { keyPath: 'id', autoIncrement: true });
          }

          // Object store for H2H records (Batch Prefetched DB)
          if (!db.objectStoreNames.contains(STORE_H2H)) {
            const h2hStore = db.createObjectStore(STORE_H2H, { keyPath: 'h2hKey' });
            h2hStore.createIndex('lastFetchedAt', 'lastFetchedAt', { unique: false });
          }
        };

        request.onsuccess = (event: Event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(true);
        };

        request.onerror = (err) => {
          console.warn('[IndexedDbStorage] Open database error, falling back to memory:', err);
          resolve(false);
        };
      } catch (err) {
        console.warn('[IndexedDbStorage] Exception during init:', err);
        resolve(false);
      }
    });
  }

  /**
   * Bulk insert / update verified match entities.
   */
  public async putMatches(entities: VerifiedMatchEntity[]): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db || entities.length === 0) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([STORE_MATCHES], 'readwrite');
        const store = tx.objectStore(STORE_MATCHES);

        for (const entity of entities) {
          store.put(entity);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Retrieve all verified matches from IndexedDB.
   */
  public async getAllMatches(): Promise<VerifiedMatchEntity[]> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_MATCHES], 'readonly');
        const store = tx.objectStore(STORE_MATCHES);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        console.warn('[IndexedDbStorage] Error reading all matches:', err);
        resolve([]);
      }
    });
  }

  /**
   * Retrieve a single verified match by ID.
   */
  public async getMatchById(id: string): Promise<VerifiedMatchEntity | null> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_MATCHES], 'readonly');
        const store = tx.objectStore(STORE_MATCHES);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        console.warn('[IndexedDbStorage] Error getting match by ID:', err);
        resolve(null);
      }
    });
  }

  /**
   * Save an audit report.
   */
  public async saveAuditReport(report: VerificationAuditReport): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_AUDITS], 'readwrite');
        const store = tx.objectStore(STORE_AUDITS);
        store.add({ ...report, createdAt: new Date().toISOString() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }

  /**
   * Bulk insert / update H2H records (Batch Prefetch).
   */
  public async putH2HRecords(records: any[]): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db || records.length === 0) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction([STORE_H2H], 'readwrite');
        const store = tx.objectStore(STORE_H2H);

        for (const r of records) {
          store.put(r);
        }

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Retrieve all H2H records from IndexedDB.
   */
  public async getAllH2HRecords(): Promise<any[]> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_H2H], 'readonly');
        const store = tx.objectStore(STORE_H2H);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        console.warn('[IndexedDbStorage] Error reading all H2H:', err);
        resolve([]);
      }
    });
  }

  /**
   * Retrieve single H2H record by key.
   */
  public async getH2HByKey(key: string): Promise<any | null> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_H2H], 'readonly');
        const store = tx.objectStore(STORE_H2H);
        const req = store.get(key);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (err) {
        resolve(null);
      }
    });
  }

  /**
   * Clear all records.
   */
  public async clear(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction([STORE_MATCHES, STORE_AUDITS, STORE_H2H], 'readwrite');
        tx.objectStore(STORE_MATCHES).clear();
        tx.objectStore(STORE_AUDITS).clear();
        tx.objectStore(STORE_H2H).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (err) {
        resolve();
      }
    });
  }
}

export const indexedDbStorage = new IndexedDbStorage();
