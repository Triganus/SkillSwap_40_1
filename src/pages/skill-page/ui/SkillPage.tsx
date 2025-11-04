import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchSkills, getSkills, getSkillsError, getSkillsLoading } from '@entities/skill/model';
import { usersActions, selectUsersState } from '@entities/user/model/usersSlice';
import type { AppDispatch } from '@app/Provider';
import type { User, DbUser } from '@entities/user/model';
import type { Skill } from '@entities/skill/model/types/types';
import { SkillCard } from '@widgets/Cards/SkillCard';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { ModalUI } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { TwoColumnLayout } from '@shared/ui/TwoColumnLayout';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { useAuth } from '@app/Provider';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import styles from './SkillPage.module.scss';

export default function SkillPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const loading = useSelector(getSkillsLoading);
  const error = useSelector(getSkillsError);
  const skills = useSelector(getSkills);
  const usersState = useSelector(selectUsersState);

  // Ищем навык по ID, но также ищем пользователя, у которого есть этот навык
  const skill = React.useMemo(() => skills.find((s) => s.id === id), [skills, id]);

  // Ищем автора навыка: сначала по authorId из навыка, если не найден - ищем пользователя, у которого есть этот навык в my_skills.teach
  const authorRaw = React.useMemo(() => {
    if (!skill) return undefined;

    // Сначала пробуем найти по authorId из навыка
    if (skill.authorId && skill.authorId !== 'mock-author-id') {
      const author = usersState.byId[skill.authorId];
      if (author) return author;
    }

    // Если не найден, ищем пользователя, у которого есть этот навык в my_skills.teach
    const allUsers = Object.values(usersState.byId);
    return allUsers.find((user) =>
      user.my_skills?.teach?.some((teachSkill) => teachSkill.skill_id === skill.id)
    );
  }, [skill, usersState.byId]);

  // Helper function to format location and age (similar to users-api.ts)
  const getAgeWord = React.useCallback((age: number): string => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
  }, []);

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

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  React.useEffect(() => {
    if (!skills.length) {
      dispatch(fetchSkills());
    }
  }, [dispatch, skills.length]);

  const [usersLoading, setUsersLoading] = useState(true);

  React.useEffect(() => {
    // ensure users are available for author and similar cards
    (async () => {
      try {
        setUsersLoading(true);
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
      } finally {
        setUsersLoading(false);
      }
    })();
  }, [dispatch]);

  const [liked, setLiked] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Получаем текущего пользователя из auth
  const currentUser = auth.user;

  // Состояние для отслеживания отправленных предложений
  const [sentExchanges, setSentExchanges] = useState<Array<{ toUserId: string; skillId: string }>>(
    []
  );

  // Загружаем отправленные предложения при монтировании
  React.useEffect(() => {
    if (currentUser) {
      const exchangesKey = `exchanges_${currentUser.id}`;
      const exchanges = JSON.parse(localStorage.getItem(exchangesKey) || '[]');
      setSentExchanges(exchanges);
    }
  }, [currentUser]);

  // Проверяем, было ли уже предложено обмен
  const isAlreadyProposed = useMemo(() => {
    if (!currentUser || !authorRaw || !skill) return false;
    return sentExchanges.some(
      (exchange) => exchange.toUserId === authorRaw.id && exchange.skillId === skill.id
    );
  }, [currentUser, authorRaw, skill, sentExchanges]);

  const onLikeClick = React.useCallback(() => {
    if (!auth.isAuthenticated)
      return navigate('/login', { replace: false, state: { from: location } });
    setLiked((v) => !v);
  }, [auth.isAuthenticated, navigate, location]);

  const handleProposeExchange = React.useCallback(() => {
    // Пользователь не авторизован
    if (!auth.isAuthenticated) {
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }

    // Пользователь авторизован
    if (!currentUser || !authorRaw || !skill) return;

    // Сохраняем запись об обмене в localStorage (временное решение)
    const exchangesKey = `exchanges_${currentUser.id}`;
    const exchanges = JSON.parse(localStorage.getItem(exchangesKey) || '[]');
    const newExchange = {
      fromUserId: currentUser.id,
      toUserId: authorRaw.id,
      skillId: skill.id,
      timestamp: new Date().toISOString(),
    };
    exchanges.push(newExchange);
    localStorage.setItem(exchangesKey, JSON.stringify(exchanges));

    // Обновляем состояние
    setSentExchanges((prev) => [...prev, { toUserId: authorRaw.id, skillId: skill.id }]);

    // TODO: Уведомление для другого пользователя через API
    // dispatch(
    //   toastActions.addToast({
    //     userId: authorRaw.id,
    //     title: 'Новое предложение!',
    //     description: `Пользователь ${currentUser.name} предложил(а) вам обмен навыками.`,
    //     actionUrl: `/profile/requests`,
    //   })
    // );

    setIsModalOpen(true);
  }, [auth.isAuthenticated, currentUser, authorRaw, skill, navigate, location]);

  const onExchangeClick = handleProposeExchange;

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

  // ВСЕ хуки должны быть вызваны ДО условных возвратов
  const authorUser: User | undefined = author;

  // Получаем описание навыка: если у навыка нет описания, ищем его в данных пользователя
  const skillDescription = React.useMemo(() => {
    if (!skill) return '';
    // Если у навыка есть описание, используем его
    if (skill.description) return skill.description;
    // Иначе ищем описание в данных пользователя
    const teachSkill = authorRaw?.my_skills?.teach?.find((t) => t.skill_id === skill.id);
    return teachSkill?.skill_description || '';
  }, [skill, authorRaw]);

  // Загружаем каталог навыков для получения изображений
  const [skillsCatalog, setSkillsCatalog] = React.useState<{
    skill_categories: Array<{
      category: string;
      skills: Array<{ skill_id: string; skill_name: string; skill_image: string }>;
    }>;
  } | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/db/skills.json');
        if (!response.ok) return;
        const data = await response.json();
        setSkillsCatalog(data);
      } catch {
        /* noop */
      }
    })();
  }, []);

  // Получаем изображения навыка из каталога
  const skillImages = React.useMemo(() => {
    if (!skill || !skillsCatalog) return [];

    // Ищем навык в каталоге по skill.id
    for (const category of skillsCatalog.skill_categories) {
      const foundSkill = category.skills.find((s) => s.skill_id === skill.id);
      if (foundSkill && foundSkill.skill_image) {
        // Возвращаем массив с изображением (путь уже правильный - начинается с /)
        // Если нужно несколько изображений, можно расширить логику
        return [foundSkill.skill_image];
      }
    }

    // Если изображение не найдено в каталоге, возвращаем пустой массив
    // MediaSlider корректно обработает отсутствие изображений
    return [];
  }, [skill, skillsCatalog]);

  // Загружаем навыки "Может научить" для автора (аналогично learningSkills)
  const teachingSkills: Skill[] = React.useMemo(() => {
    if (!authorRaw?.my_skills?.teach || !skills.length || !skill) return [];

    // Создаем мапу навыков для быстрого поиска по ID
    const skillsMap = new Map<string, Skill>();
    skills.forEach((s) => {
      skillsMap.set(s.id, s);
    });

    // Преобразуем skill_id из my_skills.teach в Skill объекты
    return authorRaw.my_skills.teach
      .map((teachSkill) => {
        // Ищем навык в загруженных навыках (из каталога)
        const existingSkill = skillsMap.get(teachSkill.skill_id);
        if (existingSkill) {
          // Используем найденный навык, но обновляем authorId
          return {
            ...existingSkill,
            authorId: authorRaw.id,
            type: 'teaching' as const,
          };
        }

        // Если навык не найден в каталоге, создаем его из данных my_skills
        // (используем category из текущего навыка как fallback)
        return {
          id: teachSkill.skill_id,
          title: teachSkill.skill_description || teachSkill.skill_id,
          description: teachSkill.skill_description || '',
          type: 'teaching' as const,
          category: skill.category, // fallback category
          authorId: authorRaw.id,
          createdAt: authorRaw.date_of_registration || new Date().toISOString(),
        };
      })
      .filter(Boolean);
  }, [authorRaw, skills, skill]);
  // Вычисляем similarCards ДО условных возвратов
  // Ищем похожие предложения: пользователей с таким же skill_id или навыками из той же категории
  const similarCards: SkillCardProps[] = React.useMemo(() => {
    if (!skill || !authorRaw) return [];

    const allUsers = Object.values(usersState.byId);
    const similarUsers: DbUser[] = [];

    // Ищем пользователей, у которых есть такой же skill_id в my_skills.teach
    // или навыки из той же категории, исключая текущего автора
    for (const user of allUsers) {
      // Пропускаем текущего автора
      if (user.id === authorRaw.id) continue;

      // Проверяем, есть ли у пользователя навыки "Может научить"
      if (!user.my_skills?.teach || user.my_skills.teach.length === 0) continue;

      // Ищем навык с таким же skill_id или из той же категории
      const hasSimilarSkill = user.my_skills.teach.some((teachSkill) => {
        // Точное совпадение по skill_id
        if (teachSkill.skill_id === skill.id) return true;

        // Или навык из той же категории (если можем определить категорию)
        const teachSkillFromCatalog = skills.find((s) => s.id === teachSkill.skill_id);
        if (teachSkillFromCatalog && teachSkillFromCatalog.category === skill.category) {
          return true;
        }

        return false;
      });

      if (hasSimilarSkill) {
        similarUsers.push(user);
        // Ограничиваем количество похожих пользователей
        if (similarUsers.length >= 12) break;
      }
    }

    // Преобразуем пользователей в SkillCardProps
    return similarUsers
      .map((dbUser) => {
        // Находим первый навык из teach, который совпадает с текущим навыком или из той же категории
        const matchingTeachSkill = dbUser.my_skills?.teach?.find((teachSkill) => {
          if (teachSkill.skill_id === skill.id) return true;
          const teachSkillFromCatalog = skills.find((s) => s.id === teachSkill.skill_id);
          return teachSkillFromCatalog && teachSkillFromCatalog.category === skill.category;
        });

        if (!matchingTeachSkill) return null;

        // Ищем навык в каталоге
        const existingSkill = skills.find((s) => s.id === matchingTeachSkill.skill_id);
        const skillForCard: Skill = existingSkill
          ? { ...existingSkill, authorId: dbUser.id, type: 'teaching' as const }
          : {
              id: matchingTeachSkill.skill_id,
              title: matchingTeachSkill.skill_description || matchingTeachSkill.skill_id,
              description: matchingTeachSkill.skill_description || '',
              type: 'teaching' as const,
              category: skill.category,
              authorId: dbUser.id,
              createdAt: dbUser.date_of_registration || new Date().toISOString(),
            };

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

        const skillId = skillForCard.id; // Сохраняем id в замыкании

        return {
          user,
          teachingSkills: [skillForCard] as Skill[],
          learningSkills: [] as Skill[],
          isLiked: false,
          onDetailsClick: () => {
            navigate(`/skill/${skillId}`);
          },
          onLikeClick: () => {
            if (!auth.isAuthenticated) {
              navigate('/login', { replace: false, state: { from: location } });
            } else {
              // TODO: implement like functionality
            }
          },
        };
      })
      .filter(Boolean) as SkillCardProps[];
  }, [
    skill,
    authorRaw,
    usersState.byId,
    skills,
    navigate,
    auth.isAuthenticated,
    location,
    getAgeWord,
  ]);

  // ТЕПЕРЬ условные возвраты идут ПОСЛЕ всех хуков
  if ((loading && !skill) || usersLoading) {
    return <PreloaderUI />;
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body" color="error">
          Ошибка: {error}
        </TextUI>
      </div>
    );
  }

  if (!skill) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body">Навык не найден.</TextUI>
      </div>
    );
  }

  if (!authorUser) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body">Автор навыка не найден.</TextUI>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Двухколоночный макет: слева - карточка пользователя, справа - детали навыка */}
      <TwoColumnLayout
        leftContent={
          <SkillCard
            mode="compact"
            user={authorUser}
            teachingSkills={teachingSkills}
            learningSkills={learningSkills}
            isLiked={liked}
            onLikeClick={onLikeClick}
            showDetailsButton={false}
            ariaLabel={`Карточка пользователя ${authorUser.name}`}
          />
        }
        rightContent={
          <SkillDetails
            title={skill.title}
            category={skill.category}
            text={skillDescription}
            images={skillImages}
            variant="want"
            isLiked={liked}
            isLikeActive={auth.isAuthenticated}
            isRequestSent={isAlreadyProposed}
            onLikeClick={onLikeClick}
            onExchangeClick={onExchangeClick}
            onShareClick={onShareClick}
            onMoreClick={onMoreClick}
          />
        }
        gap={20}
        columnPadding={24}
        containerPadding={0}
      />

      {/* Секция с похожими предложениями */}
      <div className={styles['similar-section']}>
        <CardSlider title="Похожие предложения" skillsList={similarCards} loading={loading} />
      </div>

      {/* Модальное окно подтверждения обмена */}
      {authorUser && (
        <ModalUI
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Предложение отправлено!"
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <TextUI variant="body">
              Ваше предложение об обмене навыками успешно отправлено пользователю {authorUser.name}.
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
