import { Link } from 'react-router-dom';
import { ProfilePlaceholder } from '../ProfilePlaceholder/ProfilePlaceholder';
import styles from './ProfileSkills.module.scss';

export const ProfileSkills = () => (
  <ProfilePlaceholder
    title="Мои навыки"
    description={
      <>
        Здесь появится список навыков, которыми вы готовы делиться, и тех, которые хотите изучить.
        Пока раздел не готов, вы можете{' '}
        <Link to="/create-skill" className={styles.link}>
          добавить новый навык
        </Link>{' '}
        через общий каталог.
      </>
    }
  />
);

export default ProfileSkills;

