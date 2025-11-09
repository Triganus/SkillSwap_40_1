import {
  Button,
  DatePickerUI,
  Dropdown,
  FormField,
  Icon,
  Input,
  Textarea,
  UserAvatarUpload,
  type UserAvatarUploadHandle,
} from '@/shared/ui';
import React, { useRef, useState } from 'react';
import styles from './ProfileForm.module.scss';
import {
  getGenderDropdownOptions,
  getCityDropdownOptions,
} from '@features/registration/hooks/useRegisterStep2Form';
import { parseDateFromString, formatDateToString } from '@/shared/lib/dateUtils';
import { TitleUI } from '@/shared/ui/Title';
import type { ProfileFormProps } from './types';
import { useDirectories } from '@/entities/directory';

export const ProfileForm: React.FC<ProfileFormProps> = ({
  formValue,
  isFormChanged,
  handleSubmit,
  handleInputChange,
  handleAvatarChange,
  fieldErrors,
}) => {
  const avatarRef = useRef<UserAvatarUploadHandle>(null);
  const { cities, genders } = useDirectories();

  const CITY_DROPDOWN_OPTIONS = getCityDropdownOptions(
    cities as Array<{ id: string; name: string }>
  );

  const GENDER_DROPDOWN_OPTIONS = getGenderDropdownOptions(
    genders as Array<{ id: string; name: string }>
  );

  const [editingFields, setEditingFields] = useState({
    email: false,
    name: false,
    about: false,
  });

  const toggleEdit = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.avatarUser}>
        <UserAvatarUpload
          ref={avatarRef}
          diameter={244}
          ariaLabel="Изменить аватар"
          initialSrc={formValue.avatarUrl || undefined}
          onChange={handleAvatarChange}
        >
          <div className={styles.icon}>
            <Icon
              name="gallery-edit"
              size={24}
              title="Добавить"
              fill="#253017"
              className={styles.galleryEdit}
            />
          </div>
        </UserAvatarUpload>
      </div>
      <div className={styles.formActions}>
        <div className={styles.sectionForms}>
          <div className={styles.field}>
            <FormField label="Почта" htmlFor="email" error={fieldErrors?.email || null}>
              <div className={styles.inputWithEdit}>
                <Input
                  id="email"
                  placeholder="Введите почту"
                  value={formValue.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!editingFields.email}
                  size="large"
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => toggleEdit('email')}
                  aria-label={
                    editingFields.email ? 'Завершить редактирование почты' : 'Редактировать почту'
                  }
                >
                  <Icon
                    name="edit"
                    size={24}
                    stroke="#69735D"
                    className={styles.edit}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </FormField>

            <button type="button" className={styles.changePasswordLink}>
              <TitleUI size="xsmall">Изменить пароль</TitleUI>
            </button>
          </div>

          <div className={styles.field}>
            <FormField label="Имя" htmlFor="name" error={fieldErrors?.name || null}>
              <div className={styles.inputWithEdit}>
                <Input
                  id="name"
                  placeholder="Введите ваше имя"
                  value={formValue.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editingFields.name}
                  size="large"
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => toggleEdit('name')}
                  aria-label={
                    editingFields.name ? 'Завершить редактирование имени' : 'Редактировать имя'
                  }
                >
                  <Icon
                    name="edit"
                    size={24}
                    stroke="#69735D"
                    className={styles.edit}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </FormField>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <FormField
                label="Дата рождения"
                htmlFor="birthDate"
                error={fieldErrors?.birthDate || null}
              >
                <DatePickerUI
                  selectedDate={parseDateFromString(formValue.birthDate)}
                  onChange={(date) => {
                    const formatted = date ? formatDateToString(date) : '';
                    handleInputChange('birthDate', formatted);
                  }}
                  placeholder="дд.мм.гггг"
                  maxDate={new Date()}
                  className={styles.fullWidth}
                />
              </FormField>
            </div>

            <div className={styles.field}>
              <FormField label="Пол" htmlFor="gender" error={fieldErrors?.gender || null}>
                <Dropdown
                  id="gender"
                  placeholder="Не указан"
                  options={GENDER_DROPDOWN_OPTIONS}
                  value={formValue.gender}
                  onChange={(v) => handleInputChange('gender', String(v))}
                  fit="trigger"
                  size="large"
                  className={styles.fullWidth}
                />
              </FormField>
            </div>
          </div>

          <div className={styles.field}>
            <FormField label="Город" htmlFor="city" error={fieldErrors?.city || null}>
              <Dropdown
                id="city"
                placeholder="Не указан"
                options={CITY_DROPDOWN_OPTIONS}
                value={formValue.city}
                onChange={(v) => handleInputChange('city', String(v))}
                fit="trigger"
                size="large"
                className={styles.city}
                enableSearch
              />
            </FormField>
          </div>

          <div className={styles.field}>
            <FormField label="О себе" htmlFor="aboutMyself" error={fieldErrors?.about || null}>
              <div className={styles.inputWithEdit}>
                <Textarea
                  id="aboutMyself"
                  placeholder="Расскажи о себе"
                  value={formValue.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  disabled={!editingFields.about}
                />
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => toggleEdit('about')}
                  aria-label={
                    editingFields.about
                      ? 'Завершить редактирование текста о себе'
                      : 'Редактировать текст о себе'
                  }
                >
                  <Icon
                    name="edit"
                    size={24}
                    stroke="#69735D"
                    className={styles.edit}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </FormField>
          </div>
        </div>
        <div className={styles.sectionButton}>
          <Button
            variant="primary"
            type="submit"
            className={styles.button}
            disabled={!isFormChanged}
          >
            Сохранить
          </Button>
        </div>
      </div>
    </form>
  );
};
