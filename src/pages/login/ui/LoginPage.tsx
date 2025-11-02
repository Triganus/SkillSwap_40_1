import { type FormEvent, useState, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@app/Provider';
import { useGuestHeaderContent } from '@app/layouts';
import { TwoColumnLayout } from '@shared/ui';
import { SocialAuthGroup } from '@shared/ui/AuthButton';
import { AuthMethodsSeparator } from '@shared/ui';
import { AuthForm, InfoBlock } from '@features/auth';
import { login as authLogin } from '@api/auth';
import lightBulb from '@shared/assets/images/light-bulb.svg';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const headerContent = useMemo(() => <h1 className={styles.title}>Вход</h1>, []);

  useGuestHeaderContent(headerContent);

  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };
  const from = location.state?.from?.pathname ?? '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();

    if (!emailTrimmed || !passwordTrimmed) {
      setError('Введите email и пароль');

      return;
    }

    setLoading(true);

    try {
      const result = await authLogin({ email: emailTrimmed, password: passwordTrimmed });

      login(result.user);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить вход');
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div style={{ maxWidth: 460, width: '100%' }}>
      <AuthMethodsSeparator>
        <SocialAuthGroup gap={32} />
        <AuthForm
          email={email}
          password={password}
          onSubmit={onSubmit}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          loading={loading}
          error={error}
          submitText="Войти"
          registerLinkTo="/register/1"
          registerLinkText="Зарегистрироваться"
        />
      </AuthMethodsSeparator>
    </div>
  );

  const rightContent = (
    <InfoBlock
      image={lightBulb}
      title="С возвращением в SkillSwap!"
      description="Обменивайтесь знаниями и навыками с другими людьми"
    />
  );

  return (
    <TwoColumnLayout
      leftContent={leftContent}
      rightContent={rightContent}
      gap={24}
      columnPadding={60}
      containerBackground="var(--color-background)"
      minHeight={692}
      columnJustify="center"
      columnAlign="center"
    />
  );
}
