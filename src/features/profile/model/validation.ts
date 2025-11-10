import * as yup from 'yup';

const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19|20)\d\d$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Валидация города - проверяет, что город существует в справочнике
 */
export const isValidCity = (cityId: string, cities: Array<{ id: string; name: string }>) =>
  cities.some((c) => c.id === cityId);

/**
 * Валидация пола - проверяет, что пол существует в справочнике
 */
export const isValidGender = (genderId: string, genders: Array<{ id: string; name: string }>) =>
  genders.some((g) => g.id === genderId);

/**
 * Схема валидации для формы профиля
 * @param cities - список городов из справочника
 * @param genders - список полов из справочника
 */
export const createProfileFormSchema = (
  cities: Array<{ id: string; name: string }>,
  genders: Array<{ id: string; name: string }>
) => {
  return yup
    .object({
      email: yup
        .string()
        .trim()
        .matches(emailRegex, 'Введите корректный email')
        .required('Укажите email'),
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
        .test('age', 'Минимальный возраст 14 лет', (value) => {
          if (!value) return false;
          const parts = value.split('.');
          if (parts.length !== 3) return false;
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);
          const birthDate = new Date(year, month, day);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          const dayDiff = today.getDate() - birthDate.getDate();
          const actualAge =
            monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
          return actualAge >= 14;
        })
        .required('Укажите дату рождения'),
      gender: yup
        .string()
        .test('gender', 'Выберите пол из списка', (v) => !!v && isValidGender(v, genders))
        .required('Укажите пол'),
      city: yup
        .string()
        .test('city', 'Выберите город из списка', (v) => !!v && isValidCity(v, cities))
        .required('Укажите город'),
      about: yup
        .string()
        .trim()
        .max(500, 'Максимум 500 символов')
        .notRequired(),
      avatarFile: yup
        .mixed<File>()
        .nullable()
        .notRequired()
        .test('file-size', 'Слишком большой файл (до 5 МБ)', (f) => {
          if (!f) return true;
          return f.size <= 5 * 1024 * 1024;
        })
        .test('file-type', 'Неверный тип файла', (f) => {
          if (!f) return true;
          return /^image\//.test(f.type);
        }),
    })
    .required();
};

/**
 * Тип для значений формы профиля (совместим с yup схемой)
 */
export type ProfileFormSchema = yup.InferType<ReturnType<typeof createProfileFormSchema>>;
