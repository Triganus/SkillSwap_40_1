import * as yup from 'yup';
import { useMemo } from 'react';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useWatch } from 'react-hook-form';
import { useDirectories } from '@/entities/directory';
import { selectCategoryIds } from '@/entities/directory/model/selectors';
import { useAppSelector } from '@/shared/hooks/redux';
import type { TagCategory } from '@shared/ui/Tag';
import type { Subcategory } from '@/entities/directory/model/types';

/**
 * Хелпер для получения опций городов из новой системы справочников
 * Используется в компонентах, которые загружают данные через useDirectories
 */
export const getCityDropdownOptions = (cities: Array<{ id: string; name: string }>) =>
  cities.map((c) => ({ label: c.name, value: c.id }));

/**
 * Хелпер для получения опций полов из справочника
 */
export const getGenderDropdownOptions = (genders: Array<{ id: string; name: string }>) =>
  genders.map((g) => ({ label: g.name, value: g.id }));

/**
 * Валидация города - проверяет, что город существует в справочнике
 */
export const isValidCity = (cityId: string, cities: Array<{ id: string; name: string }>) =>
  cities.some((c) => c.id === cityId);

export type RegisterStep2Values = {
  avatarFile: File | null;
  name: string;
  birthDate: string; // дд.мм.гггг
  gender: string;
  city: string;
  categories: TagCategory[]; // идентификаторы категорий
  subcategories: string[]; // ID подкатегорий из справочника
};

const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19|20)\d\d$/;

/**
 * Создаёт схему валидации для Step 2 с учётом доступных городов и подкатегорий
 * @param cities - список городов из справочника
 * @param categoryIds - список валидных ID категорий
 * @param subcategories - список подкатегорий из справочника
 * @param genders - список полов из справочника
 */
export const createRegisterStep2Schema = (
  cities: Array<{ id: string; name: string }>,
  categoryIds: string[],
  subcategories: Subcategory[],
  genders: Array<{ id: string; name: string }>
) => {
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
        .oneOf(['', ...genders.map((g) => g.id)], 'Некорректное значение')
        .required('Укажите пол'),
      city: yup
        .string()
        .test('city', 'Выберите город из списка', (v) => !!v && isValidCity(v, cities))
        .required('Укажите город'),
      categories: yup
        .array(
          yup
            .string()
            .test('category-id', 'Некорректная категория', (v) => !!v && categoryIds.includes(v))
        )
        .min(1, 'Выберите хотя бы одну категорию')
        .required('Выберите категорию'),
      subcategories: yup
        .array(
          yup.string().test('subcategory-id', 'Некорректная подкатегория', (subcategoryId, ctx) => {
            if (!subcategoryId) {
              return false;
            }

            if (!validSubcategoryIds.has(subcategoryId)) {
              return false;
            }

            const values = ctx?.from?.[0]?.value as RegisterStep2Values | undefined;

            if (!values || !values.categories || values.categories.length === 0) {
              return true;
            }

            return values.categories.some((categoryId) => {
              const categorySubcategories = categoryToSubcategories.get(categoryId);

              return categorySubcategories?.has(subcategoryId) || false;
            });
          })
        )
        .min(1, 'Выберите хотя бы один навык')
        .required('Выберите подкатегорию'),
    })
    .required();
};

/**
 * @deprecated Используйте createRegisterStep2Schema(...) для создания схемы с актуальными данными
 */
export const registerStep2Schema = createRegisterStep2Schema([], [], [], []);

export function useRegisterStep2Form(initial?: Partial<RegisterStep2Values>) {
  const { cities, subcategories, genders } = useDirectories();
  const categoryIds = useAppSelector(selectCategoryIds);

  const schema = useMemo(
    () =>
      createRegisterStep2Schema(
        cities as Array<{ id: string; name: string }>,
        categoryIds,
        subcategories as Subcategory[],
        genders as Array<{ id: string; name: string }>
      ),
    [cities, categoryIds, subcategories, genders]
  );

  const form = useValidatedForm<RegisterStep2Values>({
    schema,
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
      return schema.isValidSync(
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
  }, [schema, nameVal, birthDateVal, genderVal, cityVal, categoriesVal, subcategoriesVal]);

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
