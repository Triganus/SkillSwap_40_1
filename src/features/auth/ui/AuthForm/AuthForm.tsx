import React from 'react';
import { Input, Button } from '@shared/ui';
import styles from './AuthForm.module.scss';
import { Link } from 'react-router-dom';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FormField } from '@shared/ui/Form';
import type { FieldUI } from '@shared/hooks/useValidatedForm';

export interface AuthFormProps {
  email?: string;
  password?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  emailField?: FieldUI;
  passwordField?: FieldUI;
  register?: UseFormRegister<{ email: string; password: string }>;
  errors?: FieldErrors<{ email: string; password: string }>;
  isValid?: boolean;
  forceAllFieldsError?: boolean;
  loading?: boolean;
  error?: string | null;
  submitText?: string;
  registerLinkTo?: string;
  registerLinkText?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  actionsSlot?: React.ReactNode;
  showRegisterLink?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email = '',
  password = '',
  loading,
  error,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  register,
  errors,
  isValid,
  forceAllFieldsError,
  submitText = 'Войти',
  registerLinkTo = '/register/1',
  registerLinkText = 'Зарегистрироваться',
  emailPlaceholder = 'Введите email',
  passwordPlaceholder = 'Введите ваш пароль',
  actionsSlot,
  showRegisterLink = true,
  emailField,
  passwordField,
}) => {
  const emailErrorText = emailField?.errorText ?? null;
  const passwordErrorText = passwordField?.errorText ?? null;
  const emailHighlight = emailField?.highlight ?? false;
  const passwordHighlight = passwordField?.highlight ?? false;

  let finalEmailErrorText = emailErrorText;
  let finalPasswordErrorText = passwordErrorText;
  let finalEmailHighlight = emailHighlight;
  let finalPasswordHighlight = passwordHighlight;

  if (!emailField || !passwordField) {
    const emailFieldError = errors?.email;
    const passwordFieldError = errors?.password;

    const emailIsServer = emailFieldError?.type === 'server';
    const passwordIsServer = passwordFieldError?.type === 'server';

    finalEmailErrorText = emailIsServer
      ? null
      : ((emailFieldError?.message as string | undefined) ?? null);
    finalPasswordErrorText = passwordIsServer
      ? null
      : ((passwordFieldError?.message as string | undefined) ?? null);

    finalEmailHighlight =
      Boolean(finalEmailErrorText) || Boolean(forceAllFieldsError) || emailIsServer;
    finalPasswordHighlight =
      Boolean(finalPasswordErrorText) || Boolean(forceAllFieldsError) || passwordIsServer;
  }

  const rootError = error ?? null;
  const disableSubmit = Boolean(loading) || isValid === false;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <FormField
          label="Email"
          htmlFor="email"
          error={finalEmailErrorText}
          forceError={forceAllFieldsError}
        >
          {register ? (
            <Input
              id="email"
              type="email"
              placeholder={emailPlaceholder}
              error={finalEmailHighlight}
              autoComplete="email"
              size="large"
              className={styles.fullWidth}
              {...(emailField?.register ?? register('email'))}
            />
          ) : (
            <Input
              id="email"
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => onEmailChange?.(e.target.value)}
              autoComplete="email"
              size="large"
              className={styles.fullWidth}
            />
          )}
        </FormField>
      </div>

      <div className={styles.field}>
        <FormField
          label="Пароль"
          htmlFor="password"
          error={finalPasswordErrorText}
          forceError={forceAllFieldsError}
        >
          {register ? (
            <Input
              id="password"
              type="password"
              placeholder={passwordPlaceholder}
              error={finalPasswordHighlight}
              autoComplete="current-password"
              size="large"
              className={styles.fullWidth}
              {...(passwordField?.register ?? register('password'))}
            />
          ) : (
            <Input
              id="password"
              type="password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => onPasswordChange?.(e.target.value)}
              autoComplete="current-password"
              size="large"
              className={styles.fullWidth}
            />
          )}
        </FormField>
      </div>

      {rootError ? (
        <div role="alert" style={{ color: 'var(--color-error, #bf3920)' }}>
          {rootError}
        </div>
      ) : null}

      <div className={styles.actions}>
        {actionsSlot ?? (
          <>
            <Button type="submit" size="large" className={styles.submit} disabled={disableSubmit}>
              {loading ? 'Входим…' : submitText}
            </Button>
            {showRegisterLink && (
              <div className={styles['bottom-link']}>
                <Link to={registerLinkTo} className={styles.link}>
                  {registerLinkText}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
};
