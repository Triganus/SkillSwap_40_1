import * as yup from 'yup';
import { useMemo } from 'react';
import { useValidatedForm } from '@shared/hooks/useValidatedForm';
import { useWatch } from 'react-hook-form';
import { loginSchema } from '@features/auth/model/validation/loginSchema';

export type RegisterStep1Values = yup.InferType<typeof loginSchema>;

export function useRegisterStep1Form(initial?: Partial<RegisterStep1Values>) {
  const form = useValidatedForm<RegisterStep1Values>({
    schema: loginSchema,
    defaultValues: { email: '', password: '', ...(initial ?? {}) },
    mode: 'onChange',
    reValidateMode: 'onChange',
    autoClearServerErrors: true,
  });

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

  return { ...form, emailUI, passwordUI, canSubmit } as const;
}
