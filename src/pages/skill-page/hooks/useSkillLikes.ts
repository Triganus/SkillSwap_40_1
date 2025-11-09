import { useState, useEffect, useCallback } from 'react';
import type { Skill } from '@entities/skill/model/types/types';
import type { DbUser } from '@entities/user/model';

/**
 * Хук для работы с лайками навыка
 */
export function useSkillLikes(
  skill: Skill | undefined,
  authorRaw: DbUser | undefined,
  currentUser: { id: string } | null
) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (!skill || !authorRaw) return;

    const userId = currentUser?.id || sessionStorage.getItem('guestId');
    const likesKey = `likes_${skill.id}_${authorRaw.id}`;
    const likesData = JSON.parse(localStorage.getItem(likesKey) || '{"count": 0, "users": []}');

    if (userId) {
      const userLiked = likesData.users.includes(userId);
      setLiked(userLiked);
    } else {
      setLiked(false);
    }

    setLikesCount(likesData.count || 0);
  }, [skill, currentUser, authorRaw]);

  const onLikeClick = useCallback(() => {
    if (!skill || !authorRaw) return;

    let userId = currentUser?.id;
    if (!userId) {
      let guestId = sessionStorage.getItem('guestId');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('guestId', guestId);
      }
      userId = guestId;
    }

    const likesKey = `likes_${skill.id}_${authorRaw.id}`;
    const likesData = JSON.parse(localStorage.getItem(likesKey) || '{"count": 0, "users": []}');
    const wasLiked = likesData.users.includes(userId);

    if (wasLiked) {
      likesData.users = likesData.users.filter((id: string) => id !== userId);
      likesData.count = Math.max(0, likesData.count - 1);
      setLiked(false);
    } else {
      likesData.users.push(userId);
      likesData.count = (likesData.count || 0) + 1;
      setLiked(true);
    }

    localStorage.setItem(likesKey, JSON.stringify(likesData));
    setLikesCount(likesData.count);
  }, [skill, currentUser, authorRaw]);

  return { liked, likesCount, onLikeClick };
}
