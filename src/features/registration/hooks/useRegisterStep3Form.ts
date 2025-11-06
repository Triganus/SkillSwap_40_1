import * as yup from 'yup';
import { useMemo } from 'react';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useWatch } from 'react-hook-form';
import { getSkillsByCategory } from '@shared/lib/constants/skillCategories';
import { tagCategoryToLabel } from '@shared/lib/categoryMapper';
import type { TagCategory } from '@shared/ui/Tag';

export type RegisterStep3Values = {
  title: string;
  category: TagCategory | '';
  subcategory: string;
  description: string;
  images: File[];
};

export const CATEGORY_OPTIONS = (Object.entries(tagCategoryToLabel) as [TagCategory, string][]).map(
  ([id, label]) => ({ label, value: id })
);

const CATEGORY_IDS = Object.keys(tagCategoryToLabel) as TagCategory[];
const isValidCategoryId = (v: string): v is TagCategory => CATEGORY_IDS.includes(v as TagCategory);

export const registerStep3Schema = yup
  .object({
    title: yup
      .string()
      .trim()
      .min(2, 'Минимум 2 символа')
      .max(80, 'Максимум 80 символов')
      .required('Укажите название навыка'),
    category: yup
      .string()
      .test('category-id', 'Выберите категорию', (v) => !!v && isValidCategoryId(v))
      .required('Выберите категорию'),
    subcategory: yup
      .string()
      .test('skill', 'Выберите подкатегорию', (v, ctx) => {
        const values = ctx?.from?.[0]?.value as RegisterStep3Values | undefined;

        if (!values?.category || !v) {
          return false;
        }

        const catLabel = tagCategoryToLabel[values.category as TagCategory];

        return Boolean(catLabel) && getSkillsByCategory(catLabel).includes(v);
      })
      .required('Выберите подкатегорию'),
    description: yup
      .string()
      .trim()
      .min(10, 'Минимум 10 символов')
      .max(500, 'Максимум 500 символов')
      .required('Добавьте описание навыка'),
    images: yup
      .array(
        yup
          .mixed<File>()
          .required()
          .test('file-type', 'Неверный тип файла', (f) => !!f && /^image\//.test(f.type))
          .test(
            'file-size',
            'Слишком большой файл (до 10 МБ)',
            (f) => !!f && f.size <= 10 * 1024 * 1024
          )
      )
      .min(1, 'Загрузите хотя бы одно изображение')
      .required('Загрузите изображение'),
  })
  .required();

export function useRegisterStep3Form(initial?: Partial<RegisterStep3Values>) {
  const form = useValidatedForm<RegisterStep3Values>({
    schema: registerStep3Schema,
    defaultValues: {
      title: '',
      category: '' as RegisterStep3Values['category'],
      subcategory: '',
      description: '',
      images: [],
      ...(initial ?? {}),
    },
    mode: 'onBlur',
    reValidateMode: 'onChange',
    autoClearServerErrors: true,
  });

  const [
    titleVal = '',
    categoryVal = '',
    subcategoryVal = '',
    descriptionVal = '',
    imagesVal = [],
  ] = useWatch({
    control: form.control,
    name: ['title', 'category', 'subcategory', 'description', 'images'],
  });

  const canSubmit = useMemo(() => {
    try {
      return registerStep3Schema.isValidSync(
        {
          title: titleVal,
          category: categoryVal as TagCategory | '',
          subcategory: subcategoryVal,
          description: descriptionVal,
          images: imagesVal as File[],
        },
        { abortEarly: false }
      );
    } catch {
      return false;
    }
  }, [titleVal, categoryVal, subcategoryVal, descriptionVal, imagesVal]);

  const titleUI = form.getFieldUI('title');
  const categoryUI = form.getFieldUI('category');
  const subcategoryUI = form.getFieldUI('subcategory');
  const descriptionUI = form.getFieldUI('description');
  const imagesUI = form.getFieldUI('images');

  return {
    ...form,
    canSubmit,
    titleUI,
    categoryUI,
    subcategoryUI,
    descriptionUI,
    imagesUI,
  } as const;
}

export function buildSubcategoryOptions(category: TagCategory | '') {
  if (!category) {
    return [] as { label: string; value: string }[];
  }

  const catName = tagCategoryToLabel[category];

  if (!catName) {
    return [];
  }

  return getSkillsByCategory(catName).map((s) => ({ label: s, value: s }));
}
