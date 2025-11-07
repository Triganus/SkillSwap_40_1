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
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileForm.module.scss';
import {
  GENDER_DROPDOWN_OPTIONS,
  getCityDropdownOptions,
} from '@features/registration/hooks/useRegisterStep2Form';
import { parseDateFromString, formatDateToString } from '@/pages/register/lib/dateUtils';
import { useDirectories } from '@/entities/directory';

export type ProfileFormValues = {
  avatarFile: File | null;
  name: string;
  email: string;
  gender: string;
  city: string;
  about: string;
  birthDate: string;
};

export type ProfileFormPops = {
  formValue: ProfileFormValues;
  isFormChanged: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (field: keyof ProfileFormValues, value: string) => void;
  updateUserError?: string | null;
};

export const ProfileForm: React.FC<ProfileFormPops> = ({
  formValue,
  isFormChanged,
  handleSubmit,
  handleInputChange,
  // updateUserError
}) => {
  const avatarRef = useRef<UserAvatarUploadHandle>(null);
  const { cities } = useDirectories();

  const CITY_DROPDOWN_OPTIONS = getCityDropdownOptions(
    cities as Array<{ id: string; name: string }>
  );

  //     const [editingFields, setEditingFields] = useState({
  //         email: false,
  //         name: false,
  //         about: false,
  //     });

  //     const toggleEdit = (field: keyof typeof editingFields) => {
  //     setEditingFields(prev => ({
  //         ...prev,
  //         [field]: !prev[field]
  //     }));
  // };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.avatarUser}>
        <UserAvatarUpload
          ref={avatarRef}
          diameter={244}
          ariaLabel="Изменить аватар"
          initialSrc={formValue.avatarFile ? URL.createObjectURL(formValue.avatarFile) : undefined} // переписать
        />
      </div>
      <div className={styles.formActions}>
        <div className={styles.sectionForms}>
          <div className={styles.field}>
            <FormField
              label="Почта"
              htmlFor="email"
              // error={}
              // forceError={}
            >
              <div className={styles.inputWithEdit}>
                <Input
                  id="email"
                  placeholder="Введите почту"
                  value={formValue.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  // error={}
                  size="medium"
                  className={styles.input}
                />
                <Icon
                  name="edit"
                  size={24}
                  stroke="#69735D"
                  className={styles.edit}
                  aria-hidden="true"
                />
              </div>
            </FormField>
          </div>
          <Link to={'/500'} className={styles.changePasswordLink}>
            Изменить пароль
          </Link>

          <div className={styles.field}>
            <FormField
              label="Имя"
              htmlFor="name"
              // error={}
              // forceError={}
            >
              <div className={styles.inputWithEdit}>
                <Input
                  id="name"
                  placeholder="Введите ваше имя"
                  value={formValue.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  // error={}
                  size="medium"
                  className={styles.input}
                  disabled
                />
                <Icon
                  name="edit"
                  size={24}
                  stroke="#69735D"
                  className={styles.edit}
                  aria-hidden="true"
                />
              </div>
            </FormField>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <FormField
                label="Дата рождения"
                htmlFor="birthDate"
                // error={}
                // forceError={}
              >
                <DatePickerUI
                  selectedDate={parseDateFromString(formValue.birthDate)}
                  onChange={(date) => {
                    const formatted = date ? formatDateToString(date) : '';
                    handleInputChange('birthDate', formatted);
                  }}
                  placeholder="дд.мм.гггг"
                  maxDate={new Date()}
                  // error={}
                  // className={}
                />
              </FormField>
            </div>

            <div className={styles.field}>
              <FormField
                label="Пол"
                htmlFor="gender"
                // error={}
                // forceError={}
              >
                <Dropdown
                  id="gender"
                  placeholder="Не указан"
                  options={GENDER_DROPDOWN_OPTIONS}
                  value={formValue.gender}
                  onChange={(v) => handleInputChange('gender', String(v))}
                  fit="content"
                  size="medium"
                  // className={}
                />
              </FormField>
            </div>
          </div>

          <div className={styles.field}>
            <FormField
              label="Город"
              htmlFor="city"
              // error={}
              // forceError={}
            >
              <Dropdown
                id="city"
                placeholder="Не указан"
                options={CITY_DROPDOWN_OPTIONS}
                value={formValue.city}
                onChange={(v) => handleInputChange('city', String(v))}
                fit="trigger"
                size="medium"
                className={styles.city}
                enableSearch
              />
            </FormField>
          </div>

          <div className={styles.field}>
            <FormField
              label="О себе"
              htmlFor="aboutMyself"
              // error={}
              // forceError={}
            >
              <div className={styles.inputWithEdit}>
                <Textarea
                  id="aboutMyself"
                  placeholder="Расскажи о себе"
                  value={formValue.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  aria-label="Расскажи о себе"
                />
                <Icon
                  name="edit"
                  size={24}
                  stroke="#69735D"
                  className={styles.edit}
                  aria-hidden="true"
                />
              </div>
            </FormField>
          </div>
        </div>
        <div className={styles.sectionButton}>
          <Button
            variant="primary"
            type="submit"
            // onClick={}
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
