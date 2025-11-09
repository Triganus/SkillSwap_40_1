import * as yup from 'yup';
import { useMemo } from 'react';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useWatch } from 'react-hook-form';
import { useDirectories } from '@/entities/directory';
import { selectCategoryIds } from '@/entities/directory/model/selectors';
import { useAppSelector } from '@/shared/hooks/redux';
import type { Subcategory } from '@/entities/directory/model/types';
import type { TagCategory } from '@shared/ui/Tag';

export type RegisterStep3Values = {
  title: string;
  category: TagCategory | '';
  subcategory: string; // ID подкатегории из справочника
  description: string;
  images: File[];
};

export const createRegisterStep3Schema = (categoryIds: string[], subcategories: Subcategory[]) => {
  const validSubcategoryIds = new Set(subcategories.map((s) => s.id));
  const categoryToSubcategories = new Map<string, Set<string>>();

  subcategories.forEach((sub) => {
    if (!categoryToSubcategories.has(sub.categoryId)) {
      categoryToSubcategories.set(sub.categoryId, new Set());
    }

    categoryToSubcategories.get(sub.categoryId)!.add(sub.id);
  });

  return yup
    .object({
      title: yup
        .string()
        .trim()
        .min(2, 'Минимум 2 символа')
        .max(80, 'Максимум 80 символов')
        .required('Укажите название навыка'),
      category: yup
        .string()
        .test('category-id', 'Выберите категорию', (v) => !!v && categoryIds.includes(v))
        .required('Выберите категорию'),
      subcategory: yup
        .string()
        .test('subcategory-id', 'Выберите подкатегорию', (subcategoryId, ctx) => {
          if (!subcategoryId) {
            return false;
          }

          if (!validSubcategoryIds.has(subcategoryId)) {
            return false;
          }

          const values = ctx?.from?.[0]?.value as RegisterStep3Values | undefined;

          if (!values?.category) {
            return false;
          }

          const categorySubcategories = categoryToSubcategories.get(values.category);

          return categorySubcategories?.has(subcategoryId) || false;
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
};

export const registerStep3Schema = createRegisterStep3Schema([], []);

export function useRegisterStep3Form(initial?: Partial<RegisterStep3Values>) {
  const { subcategories } = useDirectories();
  const categoryIds = useAppSelector(selectCategoryIds);

  const schema = useMemo(
    () => createRegisterStep3Schema(categoryIds, subcategories as Subcategory[]),
    [categoryIds, subcategories]
  );

  const form = useValidatedForm<RegisterStep3Values>({
    schema,
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
      return schema.isValidSync(
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
  }, [schema, titleVal, categoryVal, subcategoryVal, descriptionVal, imagesVal]);

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

export function buildSubcategoryOptions(
  categoryId: TagCategory | '',
  subcategories: Subcategory[]
): Array<{ label: string; value: string }> {
  if (!categoryId) {
    return [];
  }

  return subcategories
    .filter((sub) => sub.categoryId === categoryId)
    .map((sub) => ({
      label: sub.name,
      value: sub.id,
    }));
}
