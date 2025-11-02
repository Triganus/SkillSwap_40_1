import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMethodsSeparator, TwoColumnLayout } from '@shared/ui';
import { SocialAuthGroup } from '@shared/ui/AuthButton';
import { AuthForm, InfoBlock } from '@features/auth';
import userInfoImage from '@shared/assets/images/user-info.svg';
import { useRegisterStep1Form } from '@features/registration/hooks/useRegisterStep1Form';
import { useRegistrationProgress, saveRegistrationData } from '@features/registration';

export default function Step1() {
  const headerTitle = useMemo(() => 'Регистрация', []);
  const navigate = useNavigate();
  const { completeStep } = useRegistrationProgress();

  const form = useRegisterStep1Form();
  const { handleSubmit, emailUI, passwordUI, canSubmit, clearServerError, setServerError } = form;

  const sha256 = async (value: string) => {
    const enc = new TextEncoder().encode(value);
    const buf = await crypto.subtle.digest('SHA-256', enc);

    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const onSubmit = handleSubmit(async (values) => {
    clearServerError();

    if (values.email.trim().toLowerCase().endsWith('@mail.ru')) {
      setServerError('Email уже используется', ['email']);

      return;
    }

    const passwordHash = await sha256(values.password.trim());

    completeStep(1, {
      step1: {
        email: values.email.trim(),
        passwordHash,
      },
    });

    saveRegistrationData({ currentStep: 2 });

    navigate('/register/2');
  });

  const leftContent = (
    <div style={{ maxWidth: 460, width: '100%' }} aria-labelledby="register-step-1-title">
      <h2 id="register-step-1-title" style={{ marginBottom: 16 }}>
        {headerTitle}
      </h2>
      <AuthMethodsSeparator>
        <SocialAuthGroup gap={32} />
        <AuthForm
          email=""
          password=""
          onSubmit={onSubmit}
          onEmailChange={() => {}}
          onPasswordChange={() => {}}
          loading={false}
          error={form.rootErrorMessage}
          submitText="Далее"
          register={form.register}
          errors={undefined}
          isValid={canSubmit}
          forceAllFieldsError={false}
          emailField={emailUI}
          passwordField={passwordUI}
          showRegisterLink={false}
        />
      </AuthMethodsSeparator>
    </div>
  );

  const rightContent = (
    <InfoBlock
      image={userInfoImage}
      title="Добро пожаловать в SkillSwap!"
      description="Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми"
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
