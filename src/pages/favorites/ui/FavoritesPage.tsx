import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import styles from './FavoritesPage.module.scss';
import { Favorites } from '@/features/favorites/ui/Favorites';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { useAuthV2 } from '@/app/Provider';
import { selectFavoriteCards } from '@/entities/user/model-v2/selectors';
import { useCallback, useEffect } from 'react';
import { fetchUsersWithSkillsThunk } from '@/entities/user/model-v2';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user: currentUser } = useAuthV2();
  const favoriteCards = useAppSelector(selectFavoriteCards);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, isAuthenticated, currentUser]);

  const handleSkillDetailsClick = useCallback(
    (userId: string) => {
      navigate(`/skill/${userId}`);
    },
    [navigate]
  );
  if (!isAuthenticated) {
    return <div>Требуется авторизация для просмотра избранного.</div>;
  }

  return (
    <div className={styles.content}>
      <ProfileSidebar />
      <div className={styles.main}>
        <Favorites
          favoriteCards={favoriteCards}
          totalCards={favoriteCards.length}
          onSkillDetailsClick={handleSkillDetailsClick}
        />
      </div>
    </div>
  );
}
