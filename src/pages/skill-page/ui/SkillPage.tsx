import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SkillCard } from '@widgets/Cards/SkillCard';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { TwoColumnLayout } from '@shared/ui/TwoColumnLayout';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { ModalUI } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { useAuth } from '@app/Provider';
import { useUserProfile } from '../hooks';
import { getCitiesFromStore, getSubcategoriesFromStore, getCategoriesFromStore } from '@/entities/directory/lib/getFromStore';
import { selectSkillCards, fetchUsersWithSkillsThunk } from '@/entities/user/model-v2';
import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import type { User } from '@/entities/user/model/types/types';
import type { Skill } from '@/entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';
import type { SkillCardProps } from '@widgets/Cards/SkillCard/type';
import styles from './SkillPage.module.scss';

export default function SkillPage() {
  const { id: userId } = useParams<{ id: string }>();
  const { auth } = useAuth();
  const dispatch = useAppDispatch();

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Загрузка профиля пользователя
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(userId);

  // Загрузка пользователей для похожих предложений
  const allUsers = useAppSelector(selectSkillCards) as SkillCardProps[];

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
    if (!profile) return [];

    return profile.canTeachSkillIds.map((skillId) => {
      const skillInfo = subcategories.find((s) => s.id === skillId);

      return {
        id: skillId,
        title: skillInfo?.name || skillId,
        description: profile.bio || '',
        type: 'teaching' as const,
        category: (skillInfo?.categoryId || 'other') as TagCategory,
        authorId: profile.id,
        createdAt: new Date().toISOString(),
      };
    });
  }, [profile, subcategories]);

  const learningSkills: Skill[] = useMemo(() => {
    if (!profile) return [];

    return profile.wantsToLearnSkills.map((skillName, index) => {
      return {
        id: `learning_${index}`,
        title: skillName,
        description: '',
        type: 'learning' as const,
        category: 'other' as TagCategory,
        authorId: profile.id,
        createdAt: new Date().toISOString(),
      };
    });
  }, [profile]);

  // Первый навык для отображения в деталях
  const primarySkill = teachingSkills[0] || null;

  // Получаем label категории и subcategory
  const categoryLabel = useMemo(() => {
    if (!primarySkill) return '';

    const category = categories.find((c) => c.id === primarySkill.category);

    return category?.name || '';
  }, [primarySkill, categories]);

  const subcategoryLabel = useMemo(() => {
    if (!primarySkill) return '';

    const subcategory = subcategories.find((s) => s.id === primarySkill.id);

    return subcategory?.name || '';
  }, [primarySkill, subcategories]);

  // Похожие карточки - пользователи с похожими навыками
  const similarCards = useMemo(() => {
    if (!profile || !allUsers.length) return [];

    const currentUserSkillIds = new Set(profile.canTeachSkillIds);
    const currentUserWantsIds = new Set(profile.wantsToLearnSkills);

    // Фильтруем пользователей, исключая текущего
    return allUsers
      .filter((card) => card.user.id !== userId)
      .map((card) => {
        // Подсчитываем совпадения навыков
        const teachingMatches = card.teachingSkills.filter(
          (skill) => currentUserSkillIds.has(skill.id) || currentUserWantsIds.has(skill.title)
        ).length;

        const learningMatches = card.learningSkills.filter(
          (skill) => currentUserSkillIds.has(skill.id) || currentUserWantsIds.has(skill.title)
        ).length;

        return {
          card,
          matchScore: teachingMatches + learningMatches,
        };
      })
      .filter((item) => item.matchScore > 0) // Только с совпадениями
      .sort((a, b) => b.matchScore - a.matchScore) // Сортируем по количеству совпадений
      .slice(0, 10) // Берем топ 10
      .map((item) => item.card);
  }, [profile, allUsers, userId]);

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

  const onLikeClick = useCallback(() => {
    console.log('Like clicked');
  }, []);

  const onExchangeClick = useCallback(() => {
    if (auth.isAuthenticated) {
      setIsModalOpen(true);
      console.log('Exchange clicked - modal opened');
    } else {
      console.log('User not authenticated');
    }
  }, [auth.isAuthenticated]);

  const onMoreClick = useCallback(() => {
    console.log('More actions clicked');
  }, []);

  // Скролл вверх при смене пользователя
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [userId]);

  // Загрузка пользователей для похожих предложений
  useEffect(() => {
    if (allUsers.length === 0) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, allUsers.length]);

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
            teachingSkills={teachingSkills}
            learningSkills={learningSkills}
            showDetailsButton={false}
            ariaLabel={`Карточка пользователя ${user.name}`}
            userBio={profile.bio}
            locationAndAge={user.bio}
            subcategory={subcategoryLabel}
          />
        }
        rightContent={
          primarySkill ? (
            <SkillDetails
              title={primarySkill.title}
              category={primarySkill.category}
              categoryLabel={categoryLabel}
              text={primarySkill.description || profile.bio}
              images={[]}
              variant="want"
              isLiked={false}
              isLikeActive={auth.isAuthenticated}
              isRequestSent={false}
              likesCount={0}
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
        leftColumnClassName={styles['profile-column']}
        rightColumnClassName={styles['details-column']}
      />

      {/* Секция похожих предложений */}
      <div className={styles['similar-section']}>
        <CardSlider
          title="Похожие предложения"
          skillsList={similarCards}
          loading={profileLoading}
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
