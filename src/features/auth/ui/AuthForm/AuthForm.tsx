import React from 'react';
import { Input, Button } from '@shared/ui';
import styles from './AuthForm.module.scss';
import { Link } from 'react-router-dom';

export interface AuthFormProps {
  email: string;
  password: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  submitText?: string;
  registerLinkTo?: string;
  registerLinkText?: string;
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  actionsSlot?: React.ReactNode;
  showRegisterLink?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  loading,
  error,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  submitText = 'Войти',
  registerLinkTo = '/register/1',
  registerLinkText = 'Зарегистрироваться',
  emailPlaceholder = 'Введите email',
  passwordPlaceholder = 'Введите ваш пароль',
  actionsSlot,
  showRegisterLink = true,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label>Email</label>
        <Input
          type="email"
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          autoComplete="email"
          size="large"
          className={styles.fullWidth}
        />
      </div>

      <div className={styles.field}>
        <label>Пароль</label>
        <Input
          type="password"
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          autoComplete="current-password"
          size="large"
          className={styles.fullWidth}
        />
      </div>

      {error ? (
        <div role="alert" style={{ color: 'var(--color-error, #bf3920)' }}>
          {error}
        </div>
      ) : null}

      <div className={styles.actions}>
        {actionsSlot ?? (
          <>
            <Button type="submit" size="large" className={styles.submit} disabled={!!loading}>
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
