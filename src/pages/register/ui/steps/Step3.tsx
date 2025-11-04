import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FormField,
  Input,
  TwoColumnLayout,
  Dropdown,
  ImageInput,
  Textarea,
} from '@shared/ui';
import { InfoBlock } from '@features/auth';
import schoolBoardImage from '@shared/assets/images/school-board.svg';
import {
  useRegistrationProgress,
  saveRegistrationData,
  clearRegistrationData,
  getRegistrationData,
  SkillConfirmModal,
} from '@features/registration';
import type { RegistrationData } from '@features/registration';
import {
  useRegisterStep3Form,
  CATEGORY_OPTIONS,
  buildSubcategoryOptions,
  type RegisterStep3Values,
} from '@features/registration/hooks/useRegisterStep3Form';
import type { TagCategory } from '@shared/ui/Tag';
import { completeRegistration } from '@api/registration';
import { useAuth } from '@app/Provider';
import styles from './Step3.module.scss';

export default function Step3() {
  const navigate = useNavigate();
  const { completeStep, data } = useRegistrationProgress();
  const { login } = useAuth();

  const initial: Partial<RegisterStep3Values> | undefined = data.step3
    ? {
        title: data.step3.title,
        category: data.step3.category as TagCategory,
        subcategory: data.step3.subcategory,
        description: data.step3.description || '',
        images: [],
      }
    : undefined;

  const savedImageUrls = data.step3?.images || [];

  const form = useRegisterStep3Form(initial);
  const {
    handleSubmit,
    setValue,
    getValues,
    clearServerError,
    canSubmit,
    rootErrorMessage,
    forceAllFieldsError,
    titleUI,
    categoryUI,
    subcategoryUI,
    descriptionUI,
  } = form;

  const [titleTouched, setTitleTouched] = useState(false);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [subcategoryTouched, setSubcategoryTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [imagesTouched, setImagesTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [modalOpen, setModalOpen] = useState(() => {
    const stored = getRegistrationData();
    return stored.confirmModalOpen || false;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sub = form.watch((_, { name }) => {
      if (name === 'category') {
        setSubcategoryTouched(false);
        setValue('subcategory', '', { shouldValidate: false, shouldDirty: true });
      }
    });

    return () => sub.unsubscribe();
  }, [form, setValue]);

  const onSubmit = handleSubmit(
    async (values) => {
      clearServerError();
      setTriedSubmit(false);

      const imageDataUrls = await filesToDataUrls(values.images);

      completeStep(3, {
        step3: {
          title: values.title.trim(),
          category: values.category as TagCategory,
          subcategory: values.subcategory,
          description: values.description.trim(),
          images: imageDataUrls,
        },
      } as Partial<RegistrationData['stepData']>);

      saveRegistrationData({ currentStep: 3, confirmModalOpen: true });
      setModalOpen(true);
    },
    () => setTriedSubmit(true)
  );

  const handleModalClose = () => {
    setModalOpen(false);
    saveRegistrationData({ confirmModalOpen: false });
  };

  const handleEdit = () => {
    setModalOpen(false);
    saveRegistrationData({ confirmModalOpen: false });
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const registrationData = getRegistrationData();

      if (
        !registrationData.stepData.step1 ||
        !registrationData.stepData.step2 ||
        !registrationData.stepData.step3
      ) {
        throw new Error('Не все шаги регистрации завершены');
      }

      const requestData = {
        email: registrationData.stepData.step1.email,
        password: registrationData.stepData.step1.passwordHash,
        avatar: registrationData.stepData.step2.avatarDataUrl,
        name: registrationData.stepData.step2.name,
        birthDate: registrationData.stepData.step2.birthDate,
        gender: registrationData.stepData.step2.gender,
        city: registrationData.stepData.step2.city,
        interests: {
          categories: registrationData.stepData.step2.categories,
          subcategories: registrationData.stepData.step2.subcategories,
        },
        skill: {
          title: registrationData.stepData.step3.title,
          category: registrationData.stepData.step3.category,
          subcategory: registrationData.stepData.step3.subcategory,
          description: registrationData.stepData.step3.description,
          images: registrationData.stepData.step3.images,
        },
      };

      const result = await completeRegistration(requestData);

      // Авторизуем пользователя
      login(result.user);

      // Очищаем данные регистрации
      clearRegistrationData();

      // Редирект на главную
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Registration completion error:', error);
      alert(error instanceof Error ? error.message : 'Произошла ошибка при завершении регистрации');
      setIsSubmitting(false);
    }
  };

  const leftContent = (
    <form className={styles.form} onSubmit={onSubmit} aria-labelledby="register-step-3-title">
      <h2 id="register-step-3-title" className={styles.header}>
        Укажите детали навыка
      </h2>

      <div className={styles.field}>
        <FormField
          label="Название навыка"
          htmlFor="skillTitle"
          error={titleTouched || triedSubmit ? titleUI.errorText : null}
          forceError={forceAllFieldsError}
        >
          {(() => {
            const reg = titleUI.register;

            return (
              <Input
                id="skillTitle"
                aria-label="Название навыка"
                placeholder="Введите название вашего навыка"
                {...reg}
                onBlur={(e) => {
                  reg.onBlur(e);
                  setTitleTouched(true);
                }}
                error={titleTouched || triedSubmit ? titleUI.highlight : false}
                className={styles.fullWidth}
              />
            );
          })()}
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Категория навыка"
          htmlFor="skillCategory"
          error={categoryTouched || triedSubmit ? categoryUI.errorText : null}
          forceError={forceAllFieldsError}
        >
          <Dropdown
            id="skillCategory"
            aria-label="Категория навыка"
            placeholder="Выберите категорию навыка"
            options={CATEGORY_OPTIONS}
            value={getValues('category')}
            onChange={(v) => {
              setCategoryTouched(true);
              setValue('category', String(v) as TagCategory, {
                shouldValidate: false,
                shouldDirty: true,
              });
            }}
            onOpenChange={(open) => open && setCategoryTouched(true)}
            fit="trigger"
            className={styles.fullWidth}
          />
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Подкатегория навыка"
          htmlFor="skillSubcategory"
          error={subcategoryTouched || triedSubmit ? subcategoryUI.errorText : null}
          forceError={forceAllFieldsError}
        >
          <Dropdown
            id="skillSubcategory"
            aria-label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            options={buildSubcategoryOptions(getValues('category') as TagCategory | '')}
            value={getValues('subcategory')}
            onChange={(v) => {
              setSubcategoryTouched(true);
              setValue('subcategory', String(v), { shouldValidate: true, shouldDirty: true });
            }}
            fit="trigger"
            className={styles.fullWidth}
            onOpenChange={(open) => open && setSubcategoryTouched(true)}
          />
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Описание"
          htmlFor="skillDescription"
          error={descriptionTouched || triedSubmit ? descriptionUI.errorText : null}
          forceError={forceAllFieldsError}
        >
          {(() => {
            const reg = descriptionUI.register;

            return (
              <Textarea
                id="skillDescription"
                aria-label="Описание навыка"
                placeholder="Коротко опишите, чему можете научить"
                {...reg}
                onBlur={(e) => {
                  reg.onBlur(e);
                  setDescriptionTouched(true);
                }}
                error={descriptionTouched || triedSubmit ? descriptionUI.highlight : false}
                className={styles['full-width']}
                rows={5}
                maxLength={500}
                showCounter
              />
            );
          })()}
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Изображения навыка"
          htmlFor="skillImages"
          error={imagesTouched || triedSubmit ? form.getFieldClientError('images') : null}
          forceError={forceAllFieldsError}
        >
          <div id="skillImages" className={styles.dropzoneWrap}>
            <ImageInput
              multiple
              ariaLabel="Перетащите или выберите изображения навыка"
              initialDataUrls={savedImageUrls}
              onFilesChange={(files) => {
                setImagesTouched(true);
                setValue('images', files, { shouldValidate: false, shouldDirty: true });
                form.clearErrors(['title', 'category', 'subcategory', 'description']);
              }}
            />
          </div>
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate('/register/2')}
          className={styles['fluid-btn']}
        >
          Назад
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={!canSubmit}
          className={styles['fluid-btn']}
        >
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
      image={schoolBoardImage}
      title="Укажите, чем вы готовы поделиться"
      description="Так другие люди смогут увидеть ваши предложения и предложить вам обмен!"
    />
  );

  return (
    <>
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
      {data.step3 && (
        <SkillConfirmModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          title="Ваше предложение"
          helpText="Пожалуйста, проверьте и подтвердите правильность данных"
          skillData={{
            title: data.step3.title,
            category: data.step3.category,
            subcategory: data.step3.subcategory,
            description: data.step3.description,
            images: data.step3.images,
          }}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

async function filesToDataUrls(files: File[]): Promise<string[]> {
  const toUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const results: string[] = [];

  for (const f of files) {
    const url = await toUrl(f);

    results.push(url);
  }

  return results;
}
