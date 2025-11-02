import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirstIncompleteStep, isStepAccessible, saveRegistrationData } from '../lib/storage';
import { StandaloneStepIndicator } from '@shared/ui';
import { PreloaderUI } from '@shared/ui/Preloader';

interface RegistrationGuardProps {
  totalSteps: number;
  children: React.ReactElement;
}

/**
 * Обертка-guard для страниц регистрации.
 * - Проверяет валидность шага (источник истины — localStorage)
 * - Во время возможного редиректа показывает компактный прелоадер
 * - Синхронизирует currentStep в хранилище
 */
export const RegistrationGuard: React.FC<RegistrationGuardProps> = ({ totalSteps, children }) => {
  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();
  const requested = Number(step ?? '1');
  const current = Number.isFinite(requested) ? requested : 1;

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(current) || current < 1 || current > totalSteps) {
      setRedirecting(true);

      navigate('/register/1', { replace: true });

      return;
    }

    const firstIncomplete = getFirstIncompleteStep(totalSteps);

    if (current > firstIncomplete) {
      setRedirecting(true);

      navigate(`/register/${firstIncomplete}`, { replace: true });

      return;
    }

    if (current > 1 && !isStepAccessible(current)) {
      setRedirecting(true);

      navigate(`/register/${firstIncomplete}`, { replace: true });

      return;
    }

    saveRegistrationData({ currentStep: current });
  }, [current, totalSteps, navigate]);

  const header = useMemo(
    () => <StandaloneStepIndicator currentStep={current} totalSteps={totalSteps} />,
    [current, totalSteps]
  );

  if (redirecting) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 300 }} aria-live="polite">
        <PreloaderUI size="small" />
      </div>
    );
  }

  return React.cloneElement(children, { header } as any);
};
