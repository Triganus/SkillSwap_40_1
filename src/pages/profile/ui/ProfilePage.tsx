import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import { ProfileForm } from '@/features/profile/ui/ProfileForm/ProfileForm';
import { useProfileForm } from '@/features/profile/model/useProfileForm';
import styles from './ProfilePage.module.scss';

// import { Link } from 'react-router-dom';
// import { useAuthV2 } from '@app/Provider';
//
// export default function ProfilePage() {
//   const { user, logout } = useAuthV2();
//
//   return (
//     <div>
//       <h1>Profile</h1>
//       {user ? (
//         <>
//           <p>{user.name}</p>
//           <button onClick={logout}>Выйти</button>
//         </>
//       ) : (
//         <p>
//           Неизвестный пользователь. <Link to="/login">Войти</Link>
//         </p>
//       )}
//     </div>
//   );
// }

export default function ProfilePage() {
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
    return (
      <div className={styles.content}>
        <div>Пожалуйста, войдите в систему для просмотра профиля</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.content}>
        <div>Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <ProfileSidebar />

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
}
