import { useState, useEffect } from 'react';
import { fetchUserProfile } from '@/api/users-api-v2';
import type { UserProfile, TeachingSkill } from '@/entities/user/model-v2';

/**
 * Хук для загрузки профиля пользователя и его навыков по ID
 */
export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<TeachingSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setSkills([]);
      setError(null);

      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchUserProfile(userId);

        if (!cancelled) {
          setProfile(data.profile);
          setSkills(data.skills);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load user profile');
          setProfile(null);
          setSkills([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, skills, loading, error };
}
