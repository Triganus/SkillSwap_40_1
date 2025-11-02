// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (delay === 0) {
      setDebounced(value);
      return;
    }

    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;

