import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGuestHeaderContent } from '@app/layouts';
import { StandaloneStepIndicator } from '@shared/ui';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import { ProtectedRegistrationStep, RegistrationGuard } from '@features/registration';

const TOTAL_STEPS = 3 as const;

export default function RegisterPage() {
  const { step } = useParams<{ step?: string }>();
  const requested = Number(step ?? '1');
  const current = Number.isFinite(requested) ? requested : 1;

  const headerContent = useMemo(
    () => <StandaloneStepIndicator currentStep={current} totalSteps={TOTAL_STEPS} />,
    [current]
  );
  useGuestHeaderContent(headerContent);

  return (
    <RegistrationGuard totalSteps={TOTAL_STEPS}>
      <div>
        {(() => {
          switch (current) {
            case 1:
              return <Step1 />;
            case 2:
              return (
                <ProtectedRegistrationStep requiredStep={1}>
                  <Step2 />
                </ProtectedRegistrationStep>
              );
            case 3:
              return (
                <ProtectedRegistrationStep requiredStep={2}>
                  <Step3 />
                </ProtectedRegistrationStep>
              );
            default:
              return <Step1 />;
          }
        })()}
      </div>
    </RegistrationGuard>
  );
}
