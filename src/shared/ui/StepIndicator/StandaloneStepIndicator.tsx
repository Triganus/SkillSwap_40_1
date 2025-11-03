import styles from '../StepIndicator/StepIndicator.module.css';

export interface StandaloneStepIndicatorProps {
  /**
   * Текущий шаг
   */
  currentStep: number;

  /**
   * Общее количество шагов
   */
  totalSteps: number;

  /**
   * Кастомный текст вместо стандартного "Шаг X из Y"
   */
  customText?: (currentStep: number, totalSteps: number) => string;

  /**
   * Дополнительный CSS класс для кастомизации
   */
  className?: string;

  /**
   * Показывать ли прогресс-бар под текстом
   * @default true
   */
  showProgress?: boolean;
}

/**
 * Standalone версия StepIndicator, которая не требует StepperProvider
 * Используется когда компонент рендерится вне контекста провайдера
 *
 * @example
 * ```tsx
 * <StandaloneStepIndicator
 *   currentStep={2}
 *   totalSteps={3}
 * />
 * ```
 */
export function StandaloneStepIndicator({
  currentStep,
  totalSteps,
  customText,
  className = '',
  showProgress = true,
}: StandaloneStepIndicatorProps) {
  const text = customText
    ? customText(currentStep, totalSteps)
    : `Шаг ${currentStep} из ${totalSteps}`;

  return (
    <div
      className={`${styles.stepIndicator} ${className}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={text}
    >
      <div className={styles.text}>{text}</div>

      {showProgress && (
        <div className={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div
                key={stepNumber}
                className={`${styles.progressSegment} ${
                  isCompleted ? styles.completed : ''
                } ${isCurrent ? styles.current : ''}`}
                aria-label={`Шаг ${stepNumber}${
                  isCompleted ? ' (завершён)' : isCurrent ? ' (текущий)' : ''
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
