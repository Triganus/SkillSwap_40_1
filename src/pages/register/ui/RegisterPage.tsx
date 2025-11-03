import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useGuestHeaderContent } from '@app/layouts';
import { StandaloneStepIndicator } from '@shared/ui';

const TOTAL_STEPS = 3 as const;

export default function RegisterPage() {
  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();

  const current = Number(step ?? '1');

  const headerContent = useMemo(
    () => (
      <>
        <StandaloneStepIndicator currentStep={current} totalSteps={TOTAL_STEPS} />
      </>
    ),
    [current]
  );

  useGuestHeaderContent(headerContent);

  if (!Number.isFinite(current) || current < 1 || current > TOTAL_STEPS) {
    return <Navigate to="/register/1" replace />;
  }

  const nextStep = current < TOTAL_STEPS ? current + 1 : undefined;
  const prevStep = current > 1 ? current - 1 : undefined;

  return (
    <div>
      <h1>Register</h1>

      <p>Содержимое шага {current}</p>

      <div style={{ display: 'flex', gap: 8 }}>
        {prevStep && <button onClick={() => navigate(`/register/${prevStep}`)}>Назад</button>}
        {nextStep ? (
          <button onClick={() => navigate(`/register/${nextStep}`)}>Дальше</button>
        ) : (
          <Link to="/login">Готово → Войти</Link>
        )}
      </div>
    </div>
  );
}
