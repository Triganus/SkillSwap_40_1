import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchSkills, getSkills, getSkillsError, getSkillsLoading } from '@entities/skill/model';
import { usersActions, selectUsersState } from '@entities/user/model/userSlice';
import type { RootState, AppDispatch } from '@app/Provider';
import { fetchUsers } from '@/api/users-api';
import type { User } from '@entities/user/model/types/types';
import type { Skill } from '@entities/skill/model/types/types';
import { SkillCard } from '@shared/ui/SkillCard';
import { SkillDetails } from '@entities/skill/ui/SkillDetails';
import { CardSlider } from '@widgets/Cards/CardSlider';
import { PreloaderUI } from '@shared/ui/Preloader';
import { TextUI } from '@shared/ui/Text';
import { useAuth } from '@app/Provider';

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
  type ExtendedUserRecord = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    createdAt?: string;
  };
  const author: User | undefined = authorRaw
    ? {
        id: authorRaw.id,
        name: authorRaw.name,
        email: authorRaw.email,
        avatar: authorRaw.avatar_image,
        bio: (authorRaw as ExtendedUserRecord).bio,
        skills: (authorRaw as ExtendedUserRecord).skills ?? [],
        createdAt: (authorRaw as ExtendedUserRecord).createdAt ?? '',
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
        const users = await fetchUsers();
        const normalized = users.reduce<Record<string, User>>((acc, u) => {
          acc[u.id] = {
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            bio: u.bio,
            skills: u.skills,
            createdAt: u.createdAt,
          };
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
  const learningSkills: Skill[] = [];

  const similarSkills: Skill[] = skills
    .filter((s) => s.id !== skill.id && s.category === skill.category)
    .slice(0, 12);
  const similarCards = similarSkills
    .map((s) => {
      const u = usersState.byId[s.authorId] as User | undefined;
      if (!u) return null;
      return {
        user: u,
        teachingSkills: [s] as Skill[],
        learningSkills: [] as Skill[],
        isLiked: false,
      };
    })
    .filter(Boolean) as Array<{
    user: User;
    teachingSkills: Skill[];
    learningSkills: Skill[];
    isLiked: boolean;
  }>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {authorUser && (
        <SkillCard
          user={authorUser}
          teachingSkills={teachingSkills}
          learningSkills={learningSkills}
          isLiked={liked}
          onLikeClick={onLikeClick}
        />
      )}

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
      />

      <CardSlider title="Похожие предложения" skillsList={similarCards} loading={loading} />
    </div>
  );
}
