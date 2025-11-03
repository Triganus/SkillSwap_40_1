import * as yup from 'yup';

export const loginSchema = yup
  .object({
    email: yup.string().trim().required('Введите email').email('Введите корректный email'),
    password: yup
      .string()
      .trim()
      .required('Введите пароль')
      .min(4, 'Пароль должен быть не короче 4 символов'),
  })
  .required();
