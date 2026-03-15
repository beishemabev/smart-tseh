import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';

/**
 * Hook to ensure we only render Zustand's persisted state after it has rehydrated on the client.
 * This prevents React hydration mismatches between Server HTML (empty state) and Client HTML (populated state).
 */
export function useStoreHydration() {
  const isHydrated = useAppStore((state) => state.isHydrated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(isHydrated);
  }, [isHydrated]);

  return hydrated;
}
