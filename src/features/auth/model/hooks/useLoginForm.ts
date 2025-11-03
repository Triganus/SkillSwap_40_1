import type * as yup from 'yup';
import { loginSchema } from '../validation/loginSchema';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export function useLoginForm() {
  const form = useValidatedForm<LoginFormValues>({
    schema: loginSchema,
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    autoClearServerErrors: true,
  });
  const setServerErrorForAllFields = (message: string) =>
    form.setServerError(message, ['email', 'password']);
  const emailUI = form.getFieldUI('email');
  const passwordUI = form.getFieldUI('password');
  const [emailVal = '', passwordVal = ''] = useWatch({
    control: form.control,
    name: ['email', 'password'],
  });

  const canSubmit = useMemo(() => {
    try {
      return loginSchema.isValidSync(
        { email: emailVal, password: passwordVal },
        { abortEarly: false }
      );
    } catch {
      return false;
    }
  }, [emailVal, passwordVal]);

  return {
    ...form,
    setServerErrorForAllFields,
    clearServerError: form.clearServerError,
    emailUI,
    passwordUI,
    canSubmit,
  } as const;
}
