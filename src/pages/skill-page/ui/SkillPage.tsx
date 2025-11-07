import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSkills, getSkills, getSkillsError, getSkillsLoading } from '@entities/skill/model';
import type { AppDispatch } from '@app/Provider';
import { useAppSelector } from '@shared/hooks/redux';
import { SkillCard } from '@widgets/Cards/SkillCard';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { ModalUI } from '@shared/ui/Modal';
import { Button } from '@shared/ui/Button';
import { TwoColumnLayout } from '@shared/ui/TwoColumnLayout';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { useAuth } from '@app/Provider';
import { useAgeFormatter } from '../hooks';
import {
  useLocationState,
  useSkillsCatalog,
  useSkillAuthor,
  useSkillImages,
  useSkillCategoryLabel,
  useUsersLoader,
  useAuthorSkills,
  useSkillDescription,
  useSimilarCards,
  useSkillLikes,
  useSkillExchange,
} from '../hooks';
import styles from './SkillPage.module.scss';

export default function SkillPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { auth } = useAuth();
  const formatAge = useAgeFormatter();

  // Загрузка данных
  const loading = useAppSelector(getSkillsLoading);
  const error = useAppSelector(getSkillsError);
  const skills = useAppSelector(getSkills);
  const skill = useMemo(() => skills.find((s) => s.id === id), [skills, id]);

  // Загрузка пользователей и каталога
  const { loading: usersLoading } = useUsersLoader();
  const { catalog: skillsCatalog } = useSkillsCatalog();

  // Получение состояния из location.state
  const { stateUserId, stateTimestamp } = useLocationState();

  // Поиск автора навыка
  const { author, authorRaw } = useSkillAuthor(skill, stateUserId);

  // Получение данных о навыке
  const skillDescription = useSkillDescription(skill, authorRaw);
  const categoryLabel = useSkillCategoryLabel(skill, skillsCatalog);
  const skillImages = useSkillImages(skill, skillsCatalog);

  // Навыки автора
  const teachingSkills = useAuthorSkills(authorRaw, skills, skill, 'teaching');
  const learningSkills = useAuthorSkills(authorRaw, skills, skill, 'learning');

  // Лайки и обмены
  const currentUser = auth.user;
  const { liked, likesCount, onLikeClick } = useSkillLikes(skill, authorRaw, currentUser);
  const { isAlreadyProposed, isModalOpen, setIsModalOpen, onExchangeClick } = useSkillExchange(
    skill,
    authorRaw,
    currentUser,
    auth.isAuthenticated
  );

  // Похожие карточки
  const similarCards = useSimilarCards(skill, authorRaw, skills, skillsCatalog, currentUser);

  // Создаем уникальный key для принудительного перерендера при смене пользователя
  const containerKey = useMemo(() => {
    return stateUserId ? `${id}-${stateUserId}-${stateTimestamp || Date.now()}` : id;
  }, [id, stateUserId, stateTimestamp]);

  // Обработчики событий
  const onShareClick = useCallback(() => {
    if (navigator.share && skill) {
      navigator
        .share({
          title: skill.title,
          text: skill.description,
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href).catch(() => {});
        });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }, [skill]);

  const onMoreClick = useCallback(() => {
    // TODO: implement more actions menu
    console.log('More actions clicked');
  }, []);

  // Загрузка навыков и скролл
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch, id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    setIsModalOpen(false);
  }, [id, stateUserId, setIsModalOpen]);

  // Условные возвраты
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

  if (!author) {
    return (
      <div style={{ padding: '24px' }}>
        <TextUI variant="body">Автор навыка не найден.</TextUI>
      </div>
    );
  }

  return (
    <div className={styles.container} key={containerKey}>
      <TwoColumnLayout
        className={styles.layout}
        leftContent={
          <SkillCard
            mode="skill-page"
            user={author}
            teachingSkills={teachingSkills}
            learningSkills={learningSkills}
            showDetailsButton={false}
            ariaLabel={`Карточка пользователя ${author.name}`}
            userBio={authorRaw?.about_me}
            locationAndAge={
              authorRaw?.location && authorRaw?.age
                ? `${authorRaw.location}, ${authorRaw.age} ${formatAge(authorRaw.age)}`
                : undefined
            }
          />
        }
        rightContent={
          <SkillDetails
            title={skill.title}
            category={skill.category}
            categoryLabel={categoryLabel}
            text={skillDescription}
            images={skillImages}
            variant="want"
            isLiked={liked}
            isLikeActive={true}
            isRequestSent={isAlreadyProposed}
            likesCount={likesCount}
            onLikeClick={onLikeClick}
            onExchangeClick={onExchangeClick}
            onShareClick={onShareClick}
            onMoreClick={onMoreClick}
          />
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

      <div className={styles['similar-section']}>
        <CardSlider title="Похожие предложения" skillsList={similarCards} loading={loading} />
      </div>

      {author && (
        <ModalUI
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Предложение отправлено!"
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <TextUI variant="body">
              Ваше предложение об обмене навыками успешно отправлено пользователю {author.name}.
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
