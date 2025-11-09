import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import { ProfileForm } from '@/features/profile/ui/ProfileForm/ProfileForm';
import { useMemo, useState } from 'react';
import type { ProfileFormValues } from '@/features/profile/ui/ProfileForm/types';
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
  const initialUserData = useMemo(
    () => ({
      avatarFile: null as File | null,
      avatarUrl:
        'https://wallpapers.com/images/hd/aesthetic-fall-violet-trees-oky7vllbfgxyfcks.jpg',
      name: 'Анна Петрова',
      email: 'anna@example.com',
      gender: 'Женский',
      city: 'Санкт-Петербург',
      about: 'Люблю барабаны и изучаю английский язык.',
      birthDate: '15.04.1990',
    }),
    []
  );

  const initialFormValue: ProfileFormValues = useMemo(
    () => ({
      avatarFile: null,
      avatarUrl: initialUserData.avatarUrl,
      email: initialUserData.email,
      name: initialUserData.name,
      birthDate: initialUserData.birthDate || '',
      gender: initialUserData.gender || '',
      city: initialUserData.city || '',
      about: initialUserData.about || '',
    }),
    [initialUserData]
  );

  const [formValue, setFormValue] = useState(initialFormValue);
  const [savedFormValue, setSavedFormValue] = useState(initialFormValue);

  const handleInputChange = (
    field: keyof Omit<ProfileFormValues, 'avatarFile' | 'avatarUrl'>,
    value: string
  ) => {
    setFormValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file: File | null) => {
    setFormValue((prev) => ({ ...prev, avatarFile: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Отправка данных:', formValue);
      setSavedFormValue(formValue);
      setFormValue((prev) => ({ ...prev, avatarFile: null }));
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  const isFormChanged = useMemo(() => {
    return (
      formValue.email !== savedFormValue.email ||
      formValue.name !== savedFormValue.name ||
      formValue.birthDate !== savedFormValue.birthDate ||
      formValue.gender !== savedFormValue.gender ||
      formValue.city !== savedFormValue.city ||
      formValue.about !== savedFormValue.about ||
      formValue.avatarUrl !== savedFormValue.avatarUrl ||
      formValue.avatarFile !== null
    );
  }, [formValue, savedFormValue]);

  return (
    <div className={styles.content}>
      <ProfileSidebar />

      <ProfileForm
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
