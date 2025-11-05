import { useState, useEffect } from 'react';

interface SkillsCatalog {
  skill_categories: Array<{
    category: string;
    skills: Array<{ skill_id: string; skill_name: string; skill_image: string }>;
  }>;
}

/**
 * Хук для загрузки каталога навыков из /db/skills.json
 */
export function useSkillsCatalog() {
  const [catalog, setCatalog] = useState<SkillsCatalog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/db/skills.json');
        if (!response.ok) {
          console.warn('[useSkillsCatalog] Failed to fetch skills catalog');
          return;
        }
        const data = await response.json();
        setCatalog(data);
      } catch (error) {
        console.error('[useSkillsCatalog] Error loading catalog:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { catalog, loading };
}
