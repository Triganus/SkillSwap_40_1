import { useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthV2 } from '@app/Provider';
import { useGuestHeaderContent } from '@app/layouts';
import { TwoColumnLayout } from '@shared/ui';
import { SocialAuthGroup } from '@shared/ui/AuthButton';
import { AuthMethodsSeparator } from '@shared/ui';
import { AuthForm, InfoBlock } from '@features/auth';
import { login as authLogin } from '@api/auth';
import lightBulb from '@shared/assets/images/light-bulb.svg';
import styles from './LoginPage.module.scss';
import { useLoginForm } from '@features/auth/model/hooks/useLoginForm';

export default function LoginPage() {
  const headerContent = useMemo(() => <h1 className={styles.title}>Вход</h1>, []);

  useGuestHeaderContent(headerContent);

  const { isAuthenticated, isLoading, login, startLogin, failLogin } = useAuthV2();
  const navigate = useNavigate();
  const location = useLocation() as unknown as { state?: { from?: Location } };
  const from = location.state?.from?.pathname ?? '/profile';

  const {
    register,
    handleSubmit,
    setServerErrorForAllFields,
    clearServerError,
    errors,
    canSubmit,
    rootErrorMessage,
    forceAllFieldsError,
    emailUI,
    passwordUI,
  } = useLoginForm();

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = handleSubmit(async (values) => {
    clearServerError();
    startLogin();

    try {
      const result = await authLogin({
        email: values.email.trim(),
        password: values.password.trim(),
      });

      login({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar_image || null,
        token: result.accessToken,
      });

      navigate(from, { replace: true });
    } catch {
      const message =
        'Email или пароль введён неверно. Пожалуйста проверьте правильность введённых данных';

      setServerErrorForAllFields(message);
      failLogin(message);
    }
  });

  const leftContent = (
    <div style={{ maxWidth: 460, width: '100%' }}>
      <AuthMethodsSeparator>
        <SocialAuthGroup gap={32} />
        <AuthForm
          email=""
          password=""
          onSubmit={onSubmit}
          onEmailChange={() => {}}
          onPasswordChange={() => {}}
          loading={isLoading}
          error={rootErrorMessage}
          submitText="Войти"
          registerLinkTo="/register/1"
          registerLinkText="Зарегистрироваться"
          register={register}
          errors={errors}
          isValid={canSubmit}
          forceAllFieldsError={forceAllFieldsError}
          emailField={emailUI}
          passwordField={passwordUI}
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
