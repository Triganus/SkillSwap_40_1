import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FormField,
  Input,
  TwoColumnLayout,
  Dropdown,
  ImageInput,
  ModalUI,
} from '@shared/ui';
import { InfoBlock } from '@features/auth';
import schoolBoardImage from '@shared/assets/images/school-board.svg';
import { useRegistrationProgress, saveRegistrationData } from '@features/registration';
import type { RegistrationData } from '@features/registration';
import {
  useRegisterStep3Form,
  CATEGORY_OPTIONS,
  buildSubcategoryOptions,
  type RegisterStep3Values,
} from '@features/registration/hooks/useRegisterStep3Form';
import type { TagCategory } from '@shared/ui/Tag';
import styles from './Step3.module.scss';

export default function Step3() {
  const navigate = useNavigate();
  const { completeStep, data } = useRegistrationProgress();

  const initial: Partial<RegisterStep3Values> | undefined = data.step3
    ? {
        title: data.step3.title,
        category: data.step3.category as TagCategory,
        subcategory: data.step3.subcategory,
        images: [],
      }
    : undefined;

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
  } = form;

  const [titleTouched, setTitleTouched] = useState(false);
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [subcategoryTouched, setSubcategoryTouched] = useState(false);
  const [imagesTouched, setImagesTouched] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
          images: imageDataUrls,
        },
      } as Partial<RegistrationData['stepData']>);

      saveRegistrationData({ currentStep: 3 });
      setModalOpen(true);
    },
    () => setTriedSubmit(true)
  );

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
          label="Изображения навыка"
          htmlFor="skillImages"
          error={imagesTouched || triedSubmit ? form.getFieldClientError('images') : null}
          forceError={forceAllFieldsError}
        >
          <div id="skillImages" className={styles.dropzoneWrap}>
            <ImageInput
              multiple
              ariaLabel="Перетащите или выберите изображения навыка"
              onFilesChange={(files) => {
                setImagesTouched(true);
                setValue('images', files, { shouldValidate: false, shouldDirty: true });
                form.clearErrors(['title', 'category', 'subcategory']);
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
      <ModalUI isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Заглушка">
        <p>Данные шага 3 сохранены в хранилище. Здесь будет следующий экран/действие.</p>
      </ModalUI>
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
