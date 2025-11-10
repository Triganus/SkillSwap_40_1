import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { selectAuthUser, updateAuthUser } from '@/entities/user/model-v2';
import { useDirectories } from '@/entities/directory';
import { createProfileFormSchema } from './validation';
import { formatDateToString, parseDateFromString } from '@/shared/lib/dateUtils';
import type { ProfileFormValues } from '@features/profile';
import { updateUserProfile } from '@/api/users-api-v2';
import { fetchUserProfile } from '@/api/users-api-v2';

export const useProfileForm = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const { cities, genders } = useDirectories();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullProfile, setFullProfile] = useState<{
    birthDate: string;
    gender: string;
    city: string;
    about: string;
  } | null>(null);

  // Загружаем полный профиль при монтировании
  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { profile } = await fetchUserProfile(authUser.id);
        const birthDate = new Date();

        birthDate.setFullYear(birthDate.getFullYear() - profile.age);

        setFullProfile({
          birthDate: formatDateToString(birthDate),
          gender: profile.gender,
          city: profile.cityId,
          about: profile.bio || '',
        });
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [authUser?.id]);

  // Схема валидации
  const validationSchema = useMemo(
    () =>
      createProfileFormSchema(
        cities as Array<{ id: string; name: string }>,
        genders as Array<{ id: string; name: string }>
      ),
    [cities, genders]
  );

  // Начальные значения формы из auth и загруженного профиля
  const initialFormValue: ProfileFormValues = useMemo(() => {
    if (!authUser || !fullProfile) {
      return {
        avatarFile: null,
        avatarUrl: null,
        email: '',
        name: '',
        birthDate: '',
        gender: '',
        city: '',
        about: '',
      };
    }

    return {
      avatarFile: null,
      avatarUrl: authUser.avatar || null,
      email: authUser.email || '',
      name: authUser.name || '',
      birthDate: fullProfile.birthDate,
      gender: fullProfile.gender,
      city: fullProfile.city,
      about: fullProfile.about,
    };
  }, [authUser, fullProfile]);

  const [formValue, setFormValue] = useState<ProfileFormValues>(initialFormValue);
  const [savedFormValue, setSavedFormValue] = useState<ProfileFormValues>(initialFormValue);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProfileFormValues, string>>>(
    {}
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Обновляем форму только при первой загрузке данных профиля
  useEffect(() => {
    if (!isInitialized && authUser && fullProfile) {
      const initialData = {
        avatarFile: null,
        avatarUrl: authUser.avatar || null,
        email: authUser.email || '',
        name: authUser.name || '',
        birthDate: fullProfile.birthDate,
        gender: fullProfile.gender,
        city: fullProfile.city,
        about: fullProfile.about,
      };

      setFormValue(initialData);
      setSavedFormValue(initialData);
      setIsInitialized(true);
    }
  }, [authUser, fullProfile, isInitialized]);

  // Проверка изменений в форме
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

  // Валидация одного поля
  const validateField = async (
    field: keyof Omit<ProfileFormValues, 'avatarFile' | 'avatarUrl'>,
    value: string
  ): Promise<string | null> => {
    try {
      await validationSchema.validateAt(field, { ...formValue, [field]: value });

      return null;
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        return error.message;
      }

      return 'Ошибка валидации';
    }
  };

  // Валидация всей формы
  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formValue, { abortEarly: false });

      setFieldErrors({});

      return true;
    } catch (error) {
      if (error && typeof error === 'object' && 'inner' in error) {
        const validationError = error as { inner: Array<{ path?: string; message: string }> };
        const errors: Partial<Record<keyof ProfileFormValues, string>> = {};

        validationError.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof ProfileFormValues] = err.message;
          }
        });

        setFieldErrors(errors);
      }

      return false;
    }
  };

  const handleInputChange = async (
    field: keyof Omit<ProfileFormValues, 'avatarFile' | 'avatarUrl'>,
    value: string
  ) => {
    setFormValue((prev) => ({ ...prev, [field]: value }));

    // Валидация при изменении
    const error = await validateField(field, value);
    setFieldErrors((prev) => {
      const newErrors = { ...prev };

      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }

      return newErrors;
    });
  };

  const handleAvatarChange = (file: File | null) => {
    setFormValue((prev) => ({ ...prev, avatarFile: file }));
    setFieldErrors((prev) => {
      const newErrors = { ...prev };

      delete newErrors.avatarFile;

      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser?.id) {
      console.error('Пользователь не авторизован');

      return;
    }

    const isValid = await validateForm();

    if (!isValid) {
      return;
    }

    setIsSaving(true);

    try {
      const birthDateObj = parseDateFromString(formValue.birthDate);
      const age = birthDateObj
        ? new Date().getFullYear() - birthDateObj.getFullYear()
        : 0;

      let avatarUrl = formValue.avatarUrl;

      if (formValue.avatarFile) {
        avatarUrl = URL.createObjectURL(formValue.avatarFile);
      }

      // Обновляем профиль на сервере
      const updatedProfile = await updateUserProfile(authUser.id, {
        name: formValue.name,
        age,
        gender: formValue.gender as 'male' | 'female' | 'not_specified',
        cityId: formValue.city,
        bio: formValue.about,
        avatar: avatarUrl,
      });

      // Обновляем auth пользователя в store
      dispatch(
        updateAuthUser({
          name: updatedProfile.name,
          avatar: updatedProfile.avatar,
        })
      );

      // Обновляем сохраненные значения
      const newSavedValue = {
        ...formValue,
        avatarFile: null,
        avatarUrl: updatedProfile.avatar,
      };

      setSavedFormValue(newSavedValue);
      setFormValue(newSavedValue);

      console.log('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formValue,
    isFormChanged,
    isLoading,
    isSaving,
    fieldErrors,
    handleInputChange,
    handleAvatarChange,
    handleSubmit,
    isAuthenticated: !!authUser,
  };
};

