import * as yup from 'yup';
import { useMemo } from 'react';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useWatch } from 'react-hook-form';
import { CITIES, isValidCity } from '@shared/lib/constants/cities';
import { GENDER_OPTIONS } from '@shared/lib/constants/gender';
import { getSkillsByCategory, isValidSkillName } from '@shared/lib/constants/skillCategories';
import { tagCategoryToLabel } from '@shared/lib/categoryMapper';
import type { TagCategory } from '@shared/ui/Tag';

export const GENDER_DROPDOWN_OPTIONS = GENDER_OPTIONS.map((o) => ({
  label: o.label,
  value: o.value,
}));
export const CITY_DROPDOWN_OPTIONS = CITIES.map((c) => ({ label: c, value: c }));
export const CATEGORY_OPTIONS = (Object.entries(tagCategoryToLabel) as [TagCategory, string][]).map(
  ([id, label]) => ({ label, value: id })
);

export type RegisterStep2Values = {
  avatarFile: File | null;
  name: string;
  birthDate: string; // дд.мм.гггг
  gender: string;
  city: string;
  categories: TagCategory[]; // идентификаторы категорий
  subcategories: string[]; // имена навыков
};

const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19|20)\d\d$/;
const CATEGORY_IDS = Object.keys(tagCategoryToLabel) as TagCategory[];
const isValidCategoryId = (v: string): v is TagCategory => CATEGORY_IDS.includes(v as TagCategory);

export const registerStep2Schema = yup
  .object({
    avatarFile: yup
      .mixed<File>()
      .nullable()
      .notRequired()
      .test('file-size', 'Слишком большой файл (до 5 МБ)', (f) => {
        if (!f) {
          return true;
        }

        return f.size <= 5 * 1024 * 1024;
      })
      .test('file-type', 'Неверный тип файла', (f) => {
        if (!f) {
          return true;
        }

        return /^image\//.test(f.type);
      }),
    name: yup
      .string()
      .trim()
      .min(2, 'Минимум 2 символа')
      .max(50, 'Максимум 50 символов')
      .required('Укажите имя'),
    birthDate: yup
      .string()
      .trim()
      .matches(dateRegex, 'Введите дату в формате дд.мм.гггг')
      .required('Укажите дату рождения'),
    gender: yup
      .string()
      .oneOf(
        GENDER_OPTIONS.map((g) => g.value),
        'Некорректное значение'
      )
      .required('Укажите пол'),
    city: yup
      .string()
      .test('city', 'Выберите город из списка', (v) => !!v && isValidCity(v))
      .required('Укажите город'),
    categories: yup
      .array(
        yup
          .string()
          .test('category-id', 'Некорректная категория', (v) => !!v && isValidCategoryId(v))
      )
      .min(1, 'Выберите хотя бы одну категорию')
      .required('Выберите категорию'),
    subcategories: yup
      .array(
        yup.string().test('skill', 'Некорректный навык', (v, ctx) => {
          if (!v) {
            return false;
          }

          const values = ctx?.from?.[0]?.value as RegisterStep2Values | undefined;

          if (!values) return isValidSkillName(v);

          const inSelected = (values.categories ?? [])
            .map((id) => tagCategoryToLabel[id])
            .some((catName) => getSkillsByCategory(catName).includes(v));

          return inSelected || isValidSkillName(v);
        })
      )
      .min(1, 'Выберите хотя бы один навык')
      .required('Выберите подкатегорию'),
  })
  .required();

export function useRegisterStep2Form(initial?: Partial<RegisterStep2Values>) {
  const form = useValidatedForm<RegisterStep2Values>({
    schema: registerStep2Schema,
    defaultValues: {
      avatarFile: null,
      name: '',
      birthDate: '',
      gender: '',
      city: '',
      categories: [],
      subcategories: [],
      ...(initial ?? {}),
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    autoClearServerErrors: true,
  });

  const [
    nameVal = '',
    birthDateVal = '',
    genderVal = '',
    cityVal = '',
    categoriesVal = [],
    subcategoriesVal = [],
  ] = useWatch({
    control: form.control,
    name: ['name', 'birthDate', 'gender', 'city', 'categories', 'subcategories'],
  });

  const canSubmit = useMemo(() => {
    try {
      return registerStep2Schema.isValidSync(
        {
          avatarFile: null,
          name: nameVal,
          birthDate: birthDateVal,
          gender: genderVal,
          city: cityVal,
          categories: categoriesVal as TagCategory[],
          subcategories: subcategoriesVal as string[],
        },
        { abortEarly: false }
      );
    } catch {
      return false;
    }
  }, [nameVal, birthDateVal, genderVal, cityVal, categoriesVal, subcategoriesVal]);

  const nameUI = form.getFieldUI('name');
  const birthDateUI = form.getFieldUI('birthDate');
  const genderUI = form.getFieldUI('gender');
  const cityUI = form.getFieldUI('city');
  const categoriesUI = form.getFieldUI('categories');
  const subcategoriesUI = form.getFieldUI('subcategories');

  return {
    ...form,
    canSubmit,
    nameUI,
    birthDateUI,
    genderUI,
    cityUI,
    categoriesUI,
    subcategoriesUI,
  } as const;
}
