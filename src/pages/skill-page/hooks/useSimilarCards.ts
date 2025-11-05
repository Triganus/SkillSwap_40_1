import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUsersState } from '@entities/user/model/usersSlice';
import type { Skill } from '@entities/skill/model/types/types';
import type { DbUser, User } from '@entities/user/model';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { TagCategory } from '@shared/ui/Tag';
import { useAgeFormatter } from './useAgeFormatter';

interface SkillsCatalog {
  skill_categories: Array<{
    category: string;
    skills: Array<{ skill_id: string; skill_name: string; skill_image: string }>;
  }>;
}

/**
 * Хук для поиска похожих карточек навыков
 */
export function useSimilarCards(
  skill: Skill | undefined,
  authorRaw: DbUser | undefined,
  skills: Skill[],
  catalog: SkillsCatalog | null,
  currentUser: { id: string } | null
) {
  const usersState = useSelector(selectUsersState);
  const navigate = useNavigate();
  const formatAge = useAgeFormatter();

  const [likesUpdateTrigger, setLikesUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleLikesUpdate = () => {
      setLikesUpdateTrigger((prev) => prev + 1);
    };
    window.addEventListener('likesUpdated', handleLikesUpdate);
    return () => {
      window.removeEventListener('likesUpdated', handleLikesUpdate);
    };
  }, []);

  const similarCards = useMemo(() => {
    if (!skill || !authorRaw) return [];

    // Читаем likesUpdateTrigger для принудительного пересчета при изменении лайков
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _trigger = likesUpdateTrigger;

    const allUsers = Object.values(usersState.byId);
    const similarUsers: DbUser[] = [];

    for (const user of allUsers) {
      if (user.id === authorRaw.id) continue;
      if (!user.my_skills?.teach || user.my_skills.teach.length === 0) continue;

      const hasSimilarSkill = user.my_skills.teach.some((teachSkill) => {
        if (teachSkill.skill_id === skill.id) return true;
        const teachSkillFromCatalog = skills.find((s) => s.id === teachSkill.skill_id);
        return teachSkillFromCatalog && teachSkillFromCatalog.category === skill.category;
      });

      if (hasSimilarSkill) {
        similarUsers.push(user);
        if (similarUsers.length >= 12) break;
      }
    }

    return similarUsers
      .map((dbUser) => {
        const matchingTeachSkill = dbUser.my_skills?.teach?.find((teachSkill) => {
          if (teachSkill.skill_id === skill.id) return true;
          const teachSkillFromCatalog = skills.find((s) => s.id === teachSkill.skill_id);
          return teachSkillFromCatalog && teachSkillFromCatalog.category === skill.category;
        });

        if (!matchingTeachSkill?.skill_id) return null;

        const existingSkill = skills.find((s) => s.id === matchingTeachSkill.skill_id);
        let skillCategory = skill.category;

        if (!existingSkill && catalog) {
          for (const category of catalog.skill_categories) {
            const catalogSkill = category.skills.find(
              (s) => s.skill_id === matchingTeachSkill.skill_id
            );
            if (catalogSkill) {
              const categoryMap: Record<string, TagCategory> = {
                'Бизнес и карьера': 'business',
                'Творчество и искусство': 'art',
                'Иностранные языки': 'languages',
                'Здоровье и спорт': 'health',
                'Дом и быт': 'home',
                Образование: 'education',
              };
              skillCategory = categoryMap[category.category] || 'other';
              break;
            }
          }
        } else if (existingSkill) {
          skillCategory = existingSkill.category;
        }

        const skillForCard: Skill = existingSkill
          ? { ...existingSkill, authorId: dbUser.id, type: 'teaching' as const }
          : {
              id: matchingTeachSkill.skill_id,
              title: matchingTeachSkill.skill_description || matchingTeachSkill.skill_id,
              description: matchingTeachSkill.skill_description || '',
              type: 'teaching' as const,
              category: skillCategory,
              authorId: dbUser.id,
              createdAt: dbUser.date_of_registration || new Date().toISOString(),
            };

        const user: User = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.contacts?.email || dbUser.email || '',
          avatar: dbUser.avatar_image
            ? dbUser.avatar_image.startsWith('/')
              ? dbUser.avatar_image
              : `/${dbUser.avatar_image}`
            : undefined,
          bio:
            dbUser.location && dbUser.age
              ? `${dbUser.location}, ${dbUser.age} ${formatAge(dbUser.age)}`
              : dbUser.about_me || '',
          skills: [],
          createdAt: dbUser.date_of_registration || new Date().toISOString(),
        };

        const skillId = skillForCard.id;
        if (!skillId) return null;

        const likesKey = `likes_${skillId}_${dbUser.id}`;
        const likesData = JSON.parse(localStorage.getItem(likesKey) || '{"count": 0, "users": []}');
        const userId = currentUser?.id || sessionStorage.getItem('guestId');
        const cardIsLiked = userId ? likesData.users.includes(userId) : false;
        const cardLikesCount = likesData.count || 0;

        return {
          user,
          teachingSkills: [skillForCard] as Skill[],
          learningSkills: [] as Skill[],
          isLiked: cardIsLiked,
          likesCount: cardLikesCount,
          onDetailsClick: () => {
            navigate(`/skill/${skillId}`, {
              replace: false,
              state: {
                userId: dbUser.id,
                timestamp: Date.now(),
                fromSimilar: true,
              },
            });
          },
          onLikeClick: () => {
            let userId = currentUser?.id;
            if (!userId) {
              let guestId = sessionStorage.getItem('guestId');
              if (!guestId) {
                guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                sessionStorage.setItem('guestId', guestId);
              }
              userId = guestId;
            }

            const likesKey = `likes_${skillId}_${dbUser.id}`;
            const likesData = JSON.parse(
              localStorage.getItem(likesKey) || '{"count": 0, "users": []}'
            );
            const wasLiked = likesData.users.includes(userId);

            if (wasLiked) {
              likesData.users = likesData.users.filter((id: string) => id !== userId);
              likesData.count = Math.max(0, likesData.count - 1);
            } else {
              likesData.users.push(userId);
              likesData.count = (likesData.count || 0) + 1;
            }

            localStorage.setItem(likesKey, JSON.stringify(likesData));
            window.dispatchEvent(new Event('likesUpdated'));
          },
        };
      })
      .filter(Boolean) as SkillCardProps[];
  }, [
    skill,
    authorRaw,
    usersState.byId,
    skills,
    catalog,
    navigate,
    formatAge,
    currentUser,
    likesUpdateTrigger,
  ]);

  return similarCards;
}
