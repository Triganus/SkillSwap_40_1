import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
  return (
    <div className={styles.content}>
      <ProfileSidebar />
      <section className={styles.main}>
        <Outlet />
      </section>
    </div>
  );
}
