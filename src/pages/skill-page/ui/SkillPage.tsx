import { useEffect, useMemo, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SkillCard } from '@widgets/Cards/SkillCard';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { TwoColumnLayout } from '@shared/ui/TwoColumnLayout';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { ModalUI } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { useAuthV2 } from '@app/Provider';
import { useUserProfile } from '../hooks';
import { useAppDispatch } from '@shared/hooks/redux';
import {
  getCitiesFromStore,
  getSubcategoriesFromStore,
  getCategoriesFromStore,
} from '@/entities/directory/lib/getFromStore';
import { fetchSimilarUsers } from '@/api/users-api-v2';
import { toggleSkillLikeThunk, toggleSkillLikeByUserIdThunk } from '@/entities/user/model-v2';
import type { User } from '@/entities/user/model/types/types';
import type { Skill } from '@/entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';
import type { SkillCardProps, SkillReference } from '@widgets/Cards/SkillCard/type';
import type { UserListItem } from '@/entities/user/model-v2';
import styles from './SkillPage.module.scss';

export default function SkillPage() {
  const { id: userId } = useParams<{ id: string }>();
  const { isAuthenticated, user: currentUser } = useAuthV2();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние похожих пользователей
  const [similarUsers, setSimilarUsers] = useState<UserListItem[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Состояние лайков
  const [likedSkills, setLikedSkills] = useState<Set<string>>(new Set());
  const [skillLikesCount, setSkillLikesCount] = useState<Map<string, number>>(new Map());
  const [likingInProgress, setLikingInProgress] = useState(false);

  // Загрузка профиля пользователя
  const { profile, skills, loading: profileLoading, error: profileError } = useUserProfile(userId);

  // Загрузка справочников
  const cities = getCitiesFromStore();
  const subcategories = getSubcategoriesFromStore();
  const categories = getCategoriesFromStore();

  // Преобразуем профиль в User и Skills для отображения
  const user: User | null = useMemo(() => {
    if (!profile) return null;

    const cityName = cities.find((c) => c.id === profile.cityId)?.name || profile.cityId;

    return {
      id: profile.id,
      name: profile.name,
      email: '',
      avatar: profile.avatar || undefined,
      gender:
        profile.gender === 'male'
          ? 'мужской'
          : profile.gender === 'female'
            ? 'женский'
            : 'не указан',
      bio: `${cityName}, ${profile.age} лет`,
      skills: [],
      createdAt: new Date().toISOString(),
    };
  }, [profile, cities]);

  const teachingSkills: Skill[] = useMemo(() => {
    if (!skills || !skills.length) return [];

    return skills.map((skill) => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      type: 'teaching' as const,
      category: skill.categoryId as TagCategory,
      subcategory: skill.subcategoryId,
      images: skill.images,
      authorId: skill.userId,
      createdAt: skill.createdAt,
    }));
  }, [skills]);

  const teachingSkillsForCard: SkillReference[] = useMemo(() => {
    if (!profile) return [];

    return profile.canTeachSkills.map((subcategoryId) => {
      const subcategory = subcategories.find((s) => s.id === subcategoryId);

      return {
        id: subcategoryId,
        title: subcategory?.name || subcategoryId,
        category: subcategory?.categoryId || 'other',
      };
    });
  }, [profile, subcategories]);

  const learningSkillsForCard: SkillReference[] = useMemo(() => {
    if (!profile) return [];

    return profile.wantsToLearnSkills.map((subcategoryId) => {
      const subcategory = subcategories.find((s) => s.id === subcategoryId);

      return {
        id: subcategoryId,
        title: subcategory?.name || subcategoryId,
        category: subcategory?.categoryId || 'other',
      };
    });
  }, [profile, subcategories]);

  // Первый навык для отображения в деталях
  const primarySkill = teachingSkills[0] || null;

  const categoryLabel = useMemo(() => {
    if (!primarySkill) return '';

    const category = categories.find((c) => c.id === primarySkill.category);

    return category?.name || '';
  }, [primarySkill, categories]);

  const subcategoryLabel = useMemo(() => {
    if (!primarySkill?.subcategory) return '';

    const subcategory = subcategories.find((s) => s.id === primarySkill.subcategory);

    return subcategory?.name || '';
  }, [primarySkill, subcategories]);

  const skillImages = useMemo(() => {
    return primarySkill?.images || [];
  }, [primarySkill]);

  // Обработчики событий
  const onShareClick = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: profile?.name || 'Навык',
          text: profile?.bio || '',
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href).catch(() => {});
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }, [profile]);

  // Обработчик лайка на странице навыка (есть skillId)
  const onLikeClick = useCallback(async () => {
    if (!isAuthenticated || !currentUser || !primarySkill || likingInProgress) {
      console.log('Cannot like: not authenticated or already in progress');
      return;
    }

    setLikingInProgress(true);

    try {
      const result = await dispatch(
        toggleSkillLikeThunk({
          userId: currentUser.id,
          skillId: primarySkill.id,
        })
      ).unwrap();

      // Обновляем локальное состояние лайков
      setLikedSkills((prev) => {
        const newSet = new Set(prev);

        if (result.liked) {
          newSet.add(primarySkill.id);
        } else {
          newSet.delete(primarySkill.id);
        }
        return newSet;
      });

      // Обновляем количество лайков
      setSkillLikesCount((prev) => {
        const newMap = new Map(prev);

        newMap.set(primarySkill.id, result.likesCount);

        return newMap;
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLikingInProgress(false);
    }
  }, [isAuthenticated, currentUser, primarySkill, dispatch, likingInProgress]);

  // Обработчик лайка в карточке (только userId владельца навыка)
  const onCardLikeClick = useCallback(
    async (skillOwnerUserId: string) => {
      if (!isAuthenticated || !currentUser || likingInProgress) {
        console.log('Cannot like: not authenticated or already in progress');

        return;
      }

      setLikingInProgress(true);

      try {
        const result = await dispatch(
          toggleSkillLikeByUserIdThunk({
            currentUserId: currentUser.id,
            skillOwnerUserId,
          })
        ).unwrap();

        // Обновляем локальное состояние лайков
        setLikedSkills((prev) => {
          const newSet = new Set(prev);

          if (result.liked) {
            newSet.add(result.skillId);
          } else {
            newSet.delete(result.skillId);
          }
          return newSet;
        });

        // Обновляем количество лайков для этого навыка
        setSkillLikesCount((prev) => {
          const newMap = new Map(prev);

          newMap.set(result.skillId, result.likesCount);

          return newMap;
        });

        // Обновляем похожих пользователей с новым количеством лайков
        setSimilarUsers((prev) =>
          prev.map((u) =>
            u.primarySkillId === result.skillId
              ? { ...u, primarySkillLikesCount: result.likesCount }
              : u
          )
        );
      } catch (error) {
        console.error('Failed to toggle like:', error);
      } finally {
        setLikingInProgress(false);
      }
    },
    [isAuthenticated, currentUser, dispatch, likingInProgress]
  );

  // Преобразование похожих пользователей в карточки
  const similarCards: SkillCardProps[] = useMemo(() => {
    return similarUsers.map((u) => {
      const cityName = cities.find((c) => c.id === u.cityId)?.name || u.cityId;

      const teachingSkillsRefs: SkillReference[] = u.canTeachSkills.map((subcategoryId) => {
        const subcategory = subcategories.find((s) => s.id === subcategoryId);
        return {
          id: subcategoryId,
          title: subcategory?.name || subcategoryId,
          category: subcategory?.categoryId || 'other',
        };
      });

      const learningSkillsRefs: SkillReference[] = u.wantsToLearnSkills.map((subcategoryId) => {
        const subcategory = subcategories.find((s) => s.id === subcategoryId);
        return {
          id: subcategoryId,
          title: subcategory?.name || subcategoryId,
          category: subcategory?.categoryId || 'other',
        };
      });

      const isLiked = u.primarySkillId ? likedSkills.has(u.primarySkillId) : false;
      const likesCount = u.primarySkillId
        ? (skillLikesCount.get(u.primarySkillId) ?? u.primarySkillLikesCount ?? 0)
        : 0;

      return {
        user: {
          id: u.id,
          name: u.name,
          email: '',
          avatar: u.avatar || undefined,
          gender: u.gender === 'male' ? 'мужской' : u.gender === 'female' ? 'женский' : 'не указан',
          bio: `${cityName}, ${u.age} лет`,
          skills: [],
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        },
        teachingSkills: teachingSkillsRefs,
        learningSkills: learningSkillsRefs,
        isLiked,
        likesCount,
        onLikeClick: () => onCardLikeClick(u.id),
        onDetailsClick: () => navigate(`/skill/${u.id}`),
      };
    });
  }, [
    similarUsers,
    cities,
    subcategories,
    likedSkills,
    skillLikesCount,
    onCardLikeClick,
    navigate,
  ]);

  const onExchangeClick = useCallback(() => {
    if (isAuthenticated) {
      setIsModalOpen(true);
      console.log('Exchange clicked - modal opened');
    } else {
      console.log('User not authenticated');
    }
  }, [isAuthenticated]);

  const onMoreClick = useCallback(() => {
    console.log('More actions clicked');
  }, []);

  // Скролл вверх при смене пользователя
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId]);

  // Инициализация количества лайков и состояния лайков из навыков
  useEffect(() => {
    if (!skills || skills.length === 0 || !currentUser) return;

    const likesMap = new Map<string, number>();
    const likedSet = new Set<string>();

    skills.forEach((skill) => {
      likesMap.set(skill.id, skill.likesCount || 0);

      if (skill.likedByUserIds?.includes(currentUser.id)) {
        likedSet.add(skill.id);
      }
    });

    setSkillLikesCount(likesMap);
    setLikedSkills(likedSet);
  }, [skills, currentUser]);

  // Загрузка похожих пользователей через API
  useEffect(() => {
    if (!profile) return;

    setLoadingSimilar(true);
    fetchSimilarUsers({
      userId: profile.id,
      canTeachSkills: profile.canTeachSkills,
      wantsToLearnSkills: profile.wantsToLearnSkills,
      limit: 10,
    })
      .then((users) => {
        setSimilarUsers(users);
      })
      .catch((error) => {
        console.error('Failed to fetch similar users:', error);
        setSimilarUsers([]);
      })
      .finally(() => {
        setLoadingSimilar(false);
      });
  }, [profile]);

  // Закрываем модальное окно при смене пользователя
  useEffect(() => {
    setIsModalOpen(false);
  }, [userId]);

  // Условные возвраты
  if (profileLoading) {
    return <PreloaderUI />;
  }

  if (profileError) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body" color="error">
          Ошибка: {profileError}
        </TextUI>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body">Пользователь не найден.</TextUI>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TwoColumnLayout
        className={styles.layout}
        leftContent={
          <SkillCard
            mode="skill-page"
            user={user}
            teachingSkills={teachingSkillsForCard}
            learningSkills={learningSkillsForCard}
            showDetailsButton={false}
            ariaLabel={`Карточка пользователя ${user.name}`}
            userBio={profile.bio}
            locationAndAge={user.bio}
          />
        }
        rightContent={
          primarySkill ? (
            <SkillDetails
              title={primarySkill.title}
              category={primarySkill.category}
              categoryLabel={categoryLabel}
              subcategory={subcategoryLabel}
              text={primarySkill.description}
              images={skillImages}
              variant="want"
              isLiked={likedSkills.has(primarySkill.id)}
              isLikeActive={isAuthenticated}
              isRequestSent={false}
              likesCount={skillLikesCount.get(primarySkill.id) || 0}
              onLikeClick={onLikeClick}
              onExchangeClick={onExchangeClick}
              onShareClick={onShareClick}
              onMoreClick={onMoreClick}
            />
          ) : (
            <div style={{ padding: '24px' }}>
              <TextUI variant="body">У пользователя пока нет навыков для обучения.</TextUI>
            </div>
          )
        }
        gap={32}
        columnPadding={0}
        leftColumnPadding={0}
        rightColumnPadding={0}
        columnBackground="transparent"
        leftColumnBackground="transparent"
        rightColumnBackground="transparent"
        containerPadding={0}
        columnsTemplate="minmax(320px, 324px) minmax(0, 1fr)"
        leftColumnClassName={styles.profileColumn}
        rightColumnClassName={styles.detailsColumn}
      />

      {/* Секция похожих предложений */}
      <div className={styles['similar-section']}>
        <CardSlider
          title="Похожие предложения"
          skillsList={similarCards}
          loading={loadingSimilar}
        />
      </div>

      {/* Модальное окно подтверждения */}
      {user && (
        <ModalUI
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Предложение отправлено!"
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <TextUI variant="body">
              Ваше предложение об обмене навыками успешно отправлено пользователю {user.name}.
            </TextUI>
            <div style={{ marginTop: '24px' }}>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </ModalUI>
      )}
    </div>
  );
}
