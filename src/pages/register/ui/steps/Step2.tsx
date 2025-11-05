import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormField, Input, TwoColumnLayout, Dropdown, UserAvatarUpload } from '@shared/ui';
import type { UserAvatarUploadHandle } from '@shared/ui';
import { InfoBlock } from '@features/auth';
import { useRegistrationProgress, saveRegistrationData } from '@features/registration';
import {
  useRegisterStep2Form,
  GENDER_DROPDOWN_OPTIONS,
  CITY_DROPDOWN_OPTIONS,
  CATEGORY_OPTIONS,
} from '@features/registration/hooks/useRegisterStep2Form';
import type { RegisterStep2Values } from '@features/registration/hooks/useRegisterStep2Form';
import { getSkillsByCategory } from '@shared/lib/constants/skillCategories';
import { tagCategoryToLabel } from '@shared/lib/categoryMapper';
import type { TagCategory } from '@shared/ui/Tag';
import profileInfoImage from '@shared/assets/images/user-info.svg';
import styles from './Step2.module.scss';

export default function Step2() {
  const navigate = useNavigate();
  const { completeStep, data } = useRegistrationProgress();

  const initial = data.step2
    ? {
        avatarFile: null,
        name: data.step2.name,
        birthDate: data.step2.birthDate,
        gender: data.step2.gender,
        city: data.step2.city,
        categories: data.step2.categories,
        subcategories: data.step2.subcategories,
      }
    : undefined;

  const form = useRegisterStep2Form(initial);
  const {
    handleSubmit,
    setValue,
    getValues,
    clearServerError,
    canSubmit,
    rootErrorMessage,
    forceAllFieldsError,
    nameUI,
    birthDateUI,
    genderUI,
    cityUI,
    categoriesUI,
    subcategoriesUI,
    watch,
  } = form;

  const avatarRef = useRef<UserAvatarUploadHandle>(null);
  const [subcategoriesTouched, setSubcategoriesTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);

  useEffect(() => {
    const sub = watch((rawValues, { name }) => {
      if (name === 'categories') {
        const values = rawValues as unknown as RegisterStep2Values;
        const categories = (values.categories ?? []) as string[];
        const allowed = new Set<string>();

        (categories ?? []).forEach((c) => getSkillsByCategory(c).forEach((s) => allowed.add(s)));

        const current = (values.subcategories ?? []) as string[];
        const filtered = current.filter((s) => allowed.has(s));

        setSubcategoriesTouched(false);
        setValue('subcategories', filtered, { shouldValidate: false, shouldDirty: true });
      }
    });

    return () => sub.unsubscribe();
  }, [setValue, watch]);

  const onSubmit = handleSubmit(
    async (values) => {
      clearServerError();
      setTriedSubmit(false);

      const file = avatarRef.current?.getFile?.() ?? values.avatarFile;
      const avatarDataUrl = file ? await fileToDataURL(file) : (data.step2?.avatarDataUrl ?? null);

      completeStep(2, {
        step2: {
          avatarDataUrl,
          name: values.name.trim(),
          birthDate: values.birthDate.trim(),
          gender: values.gender,
          city: values.city,
          categories: values.categories as TagCategory[],
          subcategories: values.subcategories,
        },
      });

      saveRegistrationData({ currentStep: 3 });

      navigate('/register/3');
    },
    () => setTriedSubmit(true)
  );

  const leftContent = (
    <form className={styles.form} onSubmit={onSubmit} aria-labelledby="register-step-2-title">
      <div className={styles.avatarWrap}>
        <UserAvatarUpload
          ref={avatarRef}
          diameter={64}
          ariaLabel="Выбрать аватар"
          initialSrc={data.step2?.avatarDataUrl ?? undefined}
        />
      </div>

      <div className={styles.field}>
        <FormField
          label="Имя"
          htmlFor="name"
          error={nameUI.errorText}
          forceError={forceAllFieldsError}
        >
          <Input
            id="name"
            placeholder="Введите ваше имя"
            {...nameUI.register}
            error={nameUI.highlight}
            className={styles.fullWidth}
            size="large"
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <div>
          <FormField
            label="Дата рождения"
            htmlFor="birthDate"
            error={birthDateUI.errorText}
            forceError={forceAllFieldsError}
          >
            <Input
              id="birthDate"
              placeholder="дд.мм.гггг"
              {...birthDateUI.register}
              error={birthDateUI.highlight}
              className={styles.fullWidth}
              size="large"
            />
          </FormField>
        </div>

        <div>
          <FormField
            label="Пол"
            htmlFor="gender"
            error={genderUI.errorText}
            forceError={forceAllFieldsError}
          >
            <Dropdown
              id="gender"
              placeholder="Не указан"
              options={GENDER_DROPDOWN_OPTIONS}
              value={getValues('gender')}
              onChange={(v) =>
                setValue('gender', String(v), { shouldValidate: true, shouldDirty: true })
              }
              fit="trigger"
              className={styles.fullWidth}
              size="large"
            />
          </FormField>
        </div>
      </div>

      <div className={styles.field}>
        <FormField
          label="Город"
          htmlFor="city"
          error={cityUI.errorText}
          forceError={forceAllFieldsError}
        >
          <Dropdown
            id="city"
            placeholder="Не указан"
            options={CITY_DROPDOWN_OPTIONS}
            value={getValues('city')}
            onChange={(v) =>
              setValue('city', String(v), { shouldValidate: true, shouldDirty: true })
            }
            enableSearch
            fit="trigger"
            className={styles.fullWidth}
            size="large"
          />
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Категория навыка, которому хотите научиться"
          htmlFor="category"
          error={categoriesUI.errorText}
          forceError={forceAllFieldsError}
        >
          <Dropdown
            id="category"
            placeholder="Выберите категорию"
            options={CATEGORY_OPTIONS}
            multiple
            value={getValues('categories')}
            onChange={(v) => {
              const next = (Array.isArray(v) ? v : [String(v)]).filter(Boolean) as TagCategory[];

              setValue('categories', next, { shouldValidate: false, shouldDirty: true });
            }}
            fit="trigger"
            className={styles.fullWidth}
            size="large"
          />
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Подкатегория навыка, которому хотите научиться"
          htmlFor="subcategory"
          error={subcategoriesTouched || triedSubmit ? subcategoriesUI.errorText : null}
          forceError={forceAllFieldsError}
        >
          <Dropdown
            id="subcategory"
            placeholder="Выберите подкатегорию"
            options={buildSubcategoryOptions(getValues('categories'))}
            multiple
            value={getValues('subcategories')}
            onChange={(v) => {
              setSubcategoriesTouched(true);
              setValue('subcategories', Array.isArray(v) ? v : [String(v)].filter(Boolean), {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onOpenChange={(open) => open && setSubcategoriesTouched(true)}
            fit="trigger"
            className={styles.fullWidth}
            size="large"
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate('/register/1')}
          className={styles.fluidBtn}
        >
          Назад
        </Button>
        <Button variant="primary" type="submit" disabled={!canSubmit} className={styles.fluidBtn}>
          Продолжить
        </Button>
      </div>

      {rootErrorMessage ? (
        <div aria-live="polite" style={{ color: 'var(--color-error, #bf3920)', marginTop: 8 }}>
          {rootErrorMessage}
        </div>
      ) : null}
    </form>
  );

  const rightContent = (
    <InfoBlock
      image={profileInfoImage}
      title="Расскажите немного о себе"
      description="Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена"
    />
  );

  return (
    <TwoColumnLayout
      leftContent={leftContent}
      rightContent={rightContent}
      gap={24}
      columnPadding={60}
      containerBackground="var(--color-background)"
      minHeight={692}
      columnJustify="center"
      columnAlign="center"
    />
  );
}

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildSubcategoryOptions(categories: string[]) {
  const set = new Set<string>();

  (categories ?? []).forEach((id) => {
    const catName = (tagCategoryToLabel as Record<string, string>)[id] ?? '';

    if (!catName) return;

    getSkillsByCategory(catName).forEach((s) => set.add(s));
  });

  return Array.from(set).map((s) => ({ label: s, value: s }));
}
