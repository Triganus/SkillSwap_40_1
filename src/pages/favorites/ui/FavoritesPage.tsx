import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import styles from './FavoritesPage.module.scss';
import { Favorites } from '@/features/favorites/ui/Favorites';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { useAuthV2 } from '@/app/Provider';
import { selectFavoriteCards } from '@/entities/user/model-v2/selectors';
import { useEffect } from 'react';
import { fetchUsersWithSkillsThunk } from '@/entities/user/model-v2';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user: currentUser } = useAuthV2();
  const favoriteCards = useAppSelector(selectFavoriteCards);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, isAuthenticated, currentUser]);

  const handleSkillDetailsClick = (userId: string) => {
    console.log(`Navigate to skill/profile of user ${userId}`);
  };

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
