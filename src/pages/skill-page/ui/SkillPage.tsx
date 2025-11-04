import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchSkills, getSkills, getSkillsError, getSkillsLoading } from '@entities/skill/model';
import { usersActions, selectUsersState } from '@entities/user/model/usersSlice';
import type { RootState, AppDispatch } from '@app/Provider';
import type { User, DbUser } from '@entities/user/model';
import type { Skill } from '@entities/skill/model/types/types';
import { SkillCard } from '@shared/ui/SkillCard';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { useAuth } from '@app/Provider';
import { TwoColumnLayout } from '@shared/ui/TwoColumnLayout';
import type { SkillCardProps } from '@shared/ui/SkillCard';

export default function SkillPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const loading = useSelector(getSkillsLoading);
  const error = useSelector(getSkillsError);
  const skills = useSelector(getSkills);
  const skill = React.useMemo(() => skills.find((s) => s.id === id), [skills, id]);

  const authorId = skill?.authorId;
  const authorRaw = useSelector((s: RootState) => (authorId ? s.users.byId[authorId] : undefined));

  // Helper function to format location and age (similar to users-api.ts)
  const getAgeWord = (age: number): string => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
  };

  const author: User | undefined = authorRaw
    ? {
        id: authorRaw.id,
        name: authorRaw.name,
        email: authorRaw.contacts?.email || authorRaw.email || '',
        avatar: authorRaw.avatar_image,
        bio:
          authorRaw.location && authorRaw.age
            ? `${authorRaw.location}, ${authorRaw.age} ${getAgeWord(authorRaw.age)}`
            : authorRaw.about_me || '',
        skills: [],
        createdAt: authorRaw.date_of_registration || new Date().toISOString(),
      }
    : undefined;
  const usersState = useSelector(selectUsersState);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  React.useEffect(() => {
    if (!skills.length) {
      dispatch(fetchSkills());
    }
  }, [dispatch, skills.length]);

  React.useEffect(() => {
    // ensure users are available for author and similar cards
    (async () => {
      try {
        const response = await fetch('/db/users.json');
        if (!response.ok) return;
        const data: { users: DbUser[] } = await response.json();
        const normalized = data.users.reduce<Record<string, DbUser>>((acc, u) => {
          acc[u.id] = u;
          return acc;
        }, {});
        dispatch(usersActions.upsertMany(normalized));
      } catch {
        /* noop */
      }
    })();
  }, [dispatch]);

  const [liked, setLiked] = React.useState(false);
  const onLikeClick = React.useCallback(() => {
    if (!auth.isAuthenticated)
      return navigate('/login', { replace: false, state: { from: location } });
    setLiked((v) => !v);
  }, [auth.isAuthenticated, navigate, location]);

  const onExchangeClick = React.useCallback(() => {
    if (!auth.isAuthenticated)
      return navigate('/login', { replace: false, state: { from: location } });
    // TODO: implement exchange flow
  }, [auth.isAuthenticated, navigate, location]);

  const onShareClick = React.useCallback(() => {
    if (navigator.share && skill) {
      navigator
        .share({
          title: skill.title,
          text: skill.description,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(window.location.href).catch(() => {
            // Silent fail
          });
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {
        // Silent fail
      });
    }
  }, [skill]);

  const onMoreClick = React.useCallback(() => {
    // TODO: implement more actions menu
    console.log('More actions clicked');
  }, []);

  // Загружаем навыки "Хочет научиться" для автора
  // Вызываем хук ДО условных возвратов, чтобы соблюдать правила хуков
  const learningSkills: Skill[] = React.useMemo(() => {
    if (!authorRaw?.my_skills?.learn || !skills.length || !skill) return [];

    // Создаем мапу навыков для быстрого поиска по ID
    const skillsMap = new Map<string, Skill>();
    skills.forEach((s) => {
      skillsMap.set(s.id, s);
    });

    // Преобразуем skill_id из my_skills.learn в Skill объекты
    return authorRaw.my_skills.learn
      .map((learnSkill) => {
        // Ищем навык в загруженных навыках (из каталога)
        const existingSkill = skillsMap.get(learnSkill.skill_id);
        if (existingSkill) {
          // Используем найденный навык, но обновляем authorId
          return {
            ...existingSkill,
            authorId: authorRaw.id,
            type: 'learning' as const,
          };
        }

        // Если навык не найден в каталоге, создаем его из данных my_skills
        // (используем category из текущего навыка как fallback)
        return {
          id: learnSkill.skill_id,
          title: learnSkill.skill_description || learnSkill.skill_id,
          description: learnSkill.skill_description || '',
          type: 'learning' as const,
          category: skill.category, // fallback category
          authorId: authorRaw.id,
          createdAt: authorRaw.date_of_registration || new Date().toISOString(),
        };
      })
      .filter(Boolean);
  }, [authorRaw, skills, skill]);

  if (loading && !skill) {
    return <PreloaderUI />;
  }

  if (error) {
    return (
      <TextUI variant="body" color="error">
        Ошибка: {error}
      </TextUI>
    );
  }

  if (!skill) {
    return <TextUI variant="body">Навык не найден.</TextUI>;
  }

  const authorUser: User | undefined = author;
  const teachingSkills: Skill[] = [skill];

  const similarSkills: Skill[] = skills
    .filter((s) => s.id !== skill.id && s.category === skill.category)
    .slice(0, 12);
  const similarCards: SkillCardProps[] = similarSkills
    .map((s) => {
      const dbUser = usersState.byId[s.authorId] as DbUser | undefined;
      if (!dbUser) return null;

      // Convert DbUser to User for SkillCard
      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.contacts?.email || dbUser.email || '',
        avatar: dbUser.avatar_image,
        bio:
          dbUser.location && dbUser.age
            ? `${dbUser.location}, ${dbUser.age} ${getAgeWord(dbUser.age)}`
            : dbUser.about_me || '',
        skills: [],
        createdAt: dbUser.date_of_registration || new Date().toISOString(),
      };

      return {
        user,
        teachingSkills: [s] as Skill[],
        learningSkills: [] as Skill[],
        isLiked: false,
        onDetailsClick: () => {
          navigate(`/skill/${s.id}`);
        },
        onLikeClick: () => {
          if (!auth.isAuthenticated) {
            navigate('/login', { replace: false, state: { from: location } });
          } else {
            // TODO: implement like functionality
            console.log('Like clicked for skill', s.id);
          }
        },
      };
    })
    .filter(Boolean) as SkillCardProps[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Двухколоночный макет: слева - карточка пользователя, справа - детали навыка */}
      <TwoColumnLayout
        leftContent={
          authorUser ? (
            <SkillCard
              user={authorUser}
              teachingSkills={teachingSkills}
              learningSkills={learningSkills}
              isLiked={liked}
              onLikeClick={onLikeClick}
              showDetailsButton={false}
              ariaLabel={`Карточка автора навыка ${skill.title}`}
            />
          ) : null
        }
        rightContent={
          <SkillDetails
            title={skill.title}
            category={skill.category}
            text={skill.description}
            images={[]}
            variant="want"
            isLiked={liked}
            isLikeActive
            isRequestSent={false}
            onLikeClick={onLikeClick}
            onExchangeClick={onExchangeClick}
            onShareClick={onShareClick}
            onMoreClick={onMoreClick}
          />
        }
        gap={24}
        columnPadding={32}
        containerPadding={0}
      />

      {/* Секция с похожими предложениями */}
      <CardSlider title="Похожие предложения" skillsList={similarCards} loading={loading} />
    </div>
  );
}
