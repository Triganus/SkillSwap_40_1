import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  useForm,
  useFormState,
  type FieldErrors,
  type Path,
  type UseFormProps,
  type UseFormRegisterReturn,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AnyObjectSchema } from 'yup';

type FieldErr = { type?: string; message?: string } | undefined;
type IndexableErrors = Record<string, FieldErr> & {
  root?: { message?: string; type?: string };
};

export interface UseValidatedFormOptions<TFieldValues extends Record<string, unknown>>
  extends Pick<UseFormProps<TFieldValues>, 'mode' | 'reValidateMode' | 'defaultValues'> {
  schema: AnyObjectSchema;
  /**
   * Очищать серверные ошибки (root и поля) при изменении любых значений формы
   * По умолчанию: true
   */
  autoClearServerErrors?: boolean;
}

export interface FieldUI {
  errorText: string | null;
  highlight: boolean;
  register: UseFormRegisterReturn;
}

export interface ValidatedFormApi<TFieldValues extends Record<string, unknown>> {
  register: ReturnType<typeof useForm<TFieldValues>>['register'];
  handleSubmit: ReturnType<typeof useForm<TFieldValues>>['handleSubmit'];
  control: ReturnType<typeof useForm<TFieldValues>>['control'];
  watch: ReturnType<typeof useForm<TFieldValues>>['watch'];
  setError: ReturnType<typeof useForm<TFieldValues>>['setError'];
  clearErrors: ReturnType<typeof useForm<TFieldValues>>['clearErrors'];
  setValue: ReturnType<typeof useForm<TFieldValues>>['setValue'];
  getValues: ReturnType<typeof useForm<TFieldValues>>['getValues'];

  // Подписанные значения состояния
  errors: FieldErrors<TFieldValues> & { root?: { message?: string; type?: string } };

  // Получение client/server состояния поля и UI-пакета
  getFieldClientError: (name: Path<TFieldValues>) => string | null;
  hasFieldServerError: (name: Path<TFieldValues>) => boolean;
  isFieldHighlighted: (name: Path<TFieldValues>) => boolean;
  getFieldUI: (name: Path<TFieldValues>) => FieldUI;

  // Root-сообщение и общий флаг форс-подсветки
  rootErrorMessage: string | null;
  forceAllFieldsError: boolean;

  // Хелперы сабмита
  getCanSubmit: (requiredFields: Array<Path<TFieldValues>>) => boolean;

  // Утилиты для серверных ошибок
  setServerError: (message: string, fields?: Array<Path<TFieldValues>>) => void;
  clearServerError: () => void;
}

/**
 * Универсальный хук формы с валидацией (Yup + RHF),
 * который возвращает подписанные на изменения ошибки и хелперы для серверных ошибок.
 */
export function useValidatedForm<TFieldValues extends Record<string, unknown>>(
  options: UseValidatedFormOptions<TFieldValues>
): ValidatedFormApi<TFieldValues> {
  const {
    schema,
    mode = 'onChange',
    reValidateMode = 'onChange',
    defaultValues,
    autoClearServerErrors = true,
  } = options;

  const form = useForm<TFieldValues>({
    mode,
    reValidateMode,
    defaultValues: defaultValues as UseFormProps<TFieldValues>['defaultValues'],
    resolver: yupResolver(schema),
  });

  const { errors } = useFormState({ control: form.control });

  const idxErrors = errors as unknown as IndexableErrors;

  const rootErrorMessage = useMemo(
    () => (idxErrors?.root?.message as string | undefined) ?? null,
    [idxErrors?.root]
  );
  const forceAllFieldsError = useMemo(() => Boolean(idxErrors?.root), [idxErrors?.root]);
  const serverFieldsRef = useRef<string[]>([]);

  const getField = useCallback(
    (name: Path<TFieldValues>): FieldErr =>
      (idxErrors?.[name as unknown as string] as FieldErr) ?? undefined,
    [idxErrors]
  );
  const getFieldClientError = useCallback(
    (name: Path<TFieldValues>): string | null => {
      const err = getField(name);
      if (!err) return null;
      if (err.type === 'server') return null;
      return (err.message as string | undefined) ?? null;
    },
    [getField]
  );
  const hasFieldServerError = useCallback(
    (name: Path<TFieldValues>): boolean => getField(name)?.type === 'server',
    [getField]
  );
  const isFieldHighlighted = useCallback(
    (name: Path<TFieldValues>): boolean =>
      Boolean(getFieldClientError(name)) || hasFieldServerError(name) || forceAllFieldsError,
    [forceAllFieldsError, getFieldClientError, hasFieldServerError]
  );
  const getFieldUI = useCallback(
    (name: Path<TFieldValues>): FieldUI => ({
      errorText: getFieldClientError(name),
      highlight: isFieldHighlighted(name),
      register: form.register(name),
    }),
    [form, getFieldClientError, isFieldHighlighted]
  );
  const setServerError = useCallback(
    (message: string, fields?: Array<Path<TFieldValues>>) => {
      form.setError('root', { type: 'server', message });

      const list = fields?.map(String) ?? [];

      serverFieldsRef.current = list;

      list.forEach((name) => {
        form.setError(name as Path<TFieldValues>, { type: 'server' });
      });
    },
    [form]
  );
  const clearServerError = useCallback(() => {
    if (idxErrors?.root) form.clearErrors('root');

    serverFieldsRef.current.forEach((name) => {
      const fe = idxErrors?.[name];

      if (fe?.type === 'server') form.clearErrors(name as Path<TFieldValues>);
    });
  }, [idxErrors, form]);

  useEffect(() => {
    if (!autoClearServerErrors) return;

    const sub = form.watch(() => {
      if (idxErrors?.root || serverFieldsRef.current.length > 0) {
        clearServerError();
      }
    });

    return () => sub.unsubscribe();
  }, [autoClearServerErrors, clearServerError, idxErrors?.root, form]);

  const getCanSubmit = useCallback(
    (requiredFields: Array<Path<TFieldValues>>): boolean => {
      const noClientErrors = requiredFields.every((f) => !getFieldClientError(f));

      if (!noClientErrors) {
        return false;
      }

      const values = form.getValues();

      return requiredFields.every((f) => {
        const v = (values as Record<string, unknown>)[f as unknown as string];

        if (typeof v === 'string') return v.trim().length > 0;

        return v !== null && v !== undefined && v !== '';
      });
    },
    [form, getFieldClientError]
  );

  return useMemo(
    () => ({
      register: form.register,
      handleSubmit: form.handleSubmit,
      control: form.control,
      watch: form.watch,
      setError: form.setError,
      clearErrors: form.clearErrors,
      setValue: form.setValue,
      getValues: form.getValues,
      errors: errors as ValidatedFormApi<TFieldValues>['errors'],
      getFieldClientError,
      hasFieldServerError,
      isFieldHighlighted,
      getFieldUI,
      rootErrorMessage,
      forceAllFieldsError,
      getCanSubmit,
      setServerError,
      clearServerError,
    }),
    [
      form,
      errors,
      getFieldClientError,
      hasFieldServerError,
      isFieldHighlighted,
      getFieldUI,
      rootErrorMessage,
      forceAllFieldsError,
      getCanSubmit,
      setServerError,
      clearServerError,
    ]
  );
}
