import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SmartTsehDB extends DBSchema {
  // We'll use a single key-value store for zustand-persist
  'zustand-store': {
    key: string;
    value: any;
  };
}

const DB_NAME = 'SmartTseh-Offline-DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SmartTsehDB>> | null = null;

const getDB = async () => {
  if (typeof window === 'undefined') return null; // Prevent SSR issues
  if (!dbPromise) {
    dbPromise = openDB<SmartTsehDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('zustand-store')) {
          db.createObjectStore('zustand-store');
        }
      },
    });
  }
  return dbPromise;
};

// Custom storage adapter for Zustand
export const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const db = await getDB();
      if (!db) return null;
      const val = await db.get('zustand-store', name);
      return val ? JSON.stringify(val) : null;
    } catch (e) {
      console.error('idbStorage getItem Error:', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const db = await getDB();
      if (!db) return;
      const parsed = JSON.parse(value);
      await db.put('zustand-store', parsed, name);
    } catch (e) {
      console.error('idbStorage setItem Error:', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const db = await getDB();
      if (!db) return;
      await db.delete('zustand-store', name);
    } catch (e) {
      console.error('idbStorage removeItem Error:', e);
    }
  },
};
