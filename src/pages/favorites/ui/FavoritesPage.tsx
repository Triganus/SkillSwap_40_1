import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import styles from './FavoritesPage.module.scss';

export default function FavoritesPage() {
  return (
    <div className={styles.content}>
      <ProfileSidebar />
      <div className={styles.main}></div>
    </div>
  );
}
