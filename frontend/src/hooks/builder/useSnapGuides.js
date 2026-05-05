import { useMemo } from 'react';

export function useSnapGuides(placement) {
  return useMemo(() => {
    if (!placement?.active) return [];
    return placement.guides || [];
  }, [placement]);
}

