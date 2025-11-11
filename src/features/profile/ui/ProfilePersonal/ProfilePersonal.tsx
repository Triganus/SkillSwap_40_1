import styles from './ProfilePersonal.module.scss';
import { ProfileForm } from '../ProfileForm/ProfileForm';
import { useProfileForm } from '../../model/useProfileForm';

export const ProfilePersonal = () => {
  const {
    formValue,
    isFormChanged,
    isLoading,
    isSaving,
    fieldErrors,
    handleInputChange,
    handleAvatarChange,
    handleSubmit,
    isAuthenticated,
  } = useProfileForm();

  if (!isAuthenticated) {
    return <div className={styles.state}>Пожалуйста, войдите в систему, чтобы просматривать профиль.</div>;
  }

  if (isLoading) {
    return <div className={styles.state}>Загрузка профиля...</div>;
  }

  return (
    <div className={styles.container}>
      <ProfileForm
        formValue={formValue}
        isFormChanged={isFormChanged}
        isSaving={isSaving}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleAvatarChange={handleAvatarChange}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};

export default ProfilePersonal;

