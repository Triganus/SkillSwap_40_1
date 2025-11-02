import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StandaloneStepIndicator } from '@/shared/ui/StepIndicator/StandaloneStepIndicator';

const meta = {
  title: 'Stepper/StandaloneStepIndicator',
  component: StandaloneStepIndicator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Индикатор шагов без зависимости от контекста. Принимает currentStep и totalSteps через props. Идеален для использования в портированных компонентах (например, через портал или в другой части дерева React).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Текущий шаг (начиная с 1)',
    },
    totalSteps: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Общее количество шагов',
    },
    showProgress: {
      control: 'boolean',
      description: 'Показывать ли прогресс-бар',
    },
    customText: {
      control: false,
      description: 'Функция для кастомизации текста',
    },
    className: {
      control: 'text',
      description: 'Дополнительный CSS класс',
    },
  },
} satisfies Meta<typeof StandaloneStepIndicator>;

export default meta;

type Story = StoryObj<typeof StandaloneStepIndicator>;

/**
 * Базовый пример с 3 шагами, текущий - первый
 */
export const Step1Of3: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
    showProgress: true,
  },
};

/**
 * Второй шаг из трёх - показывает прогресс
 */
export const Step2Of3: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    showProgress: true,
  },
};

/**
 * Последний шаг - все сегменты заполнены
 */
export const Step3Of3: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
    showProgress: true,
  },
};

/**
 * Большое количество шагов (5)
 */
export const Step2Of5: Story = {
  args: {
    currentStep: 2,
    totalSteps: 5,
    showProgress: true,
  },
};

/**
 * Только текст без прогресс-бара
 */
export const WithoutProgressBar: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
    showProgress: false,
  },
};

/**
 * Кастомный текст через функцию
 */
export const CustomText: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
    showProgress: true,
    customText: (current, total) => `Этап ${current} / ${total}`,
  },
};

/**
 * Одношаговый процесс (edge case)
 */
export const SingleStep: Story = {
  args: {
    currentStep: 1,
    totalSteps: 1,
    showProgress: true,
  },
};

/**
 * Много шагов для тестирования адаптивности
 */
export const ManySteps: Story = {
  args: {
    currentStep: 5,
    totalSteps: 10,
    showProgress: true,
  },
};

/**
 * Разные варианты в одном сториборде
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Шаг 1 из 3</h3>
        <StandaloneStepIndicator currentStep={1} totalSteps={3} />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Шаг 2 из 3</h3>
        <StandaloneStepIndicator currentStep={2} totalSteps={3} />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
          Шаг 3 из 3 (завершено)
        </h3>
        <StandaloneStepIndicator currentStep={3} totalSteps={3} />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Кастомный текст</h3>
        <StandaloneStepIndicator
          currentStep={2}
          totalSteps={4}
          customText={(c, t) => `Этап ${c} из ${t}`}
        />
      </div>

      <div>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>Без прогресс-бара</h3>
        <StandaloneStepIndicator currentStep={2} totalSteps={3} showProgress={false} />
      </div>
    </div>
  ),
};

/**
 * Интерактивное переключение между шагами
 */
const InteractiveStepperComponent = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setCurrentStep(1);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <StandaloneStepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: currentStep === 1 ? '#f5f5f5' : '#fff',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          ← Назад
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === totalSteps}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: currentStep === totalSteps ? '#f5f5f5' : '#007bff',
            color: currentStep === totalSteps ? '#999' : '#fff',
            cursor: currentStep === totalSteps ? 'not-allowed' : 'pointer',
            opacity: currentStep === totalSteps ? 0.5 : 1,
          }}
        >
          {currentStep === totalSteps ? 'Завершено' : 'Далее →'}
        </button>

        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          ↻ Сброс
        </button>
      </div>

      <div
        style={{ padding: '16px', background: '#f9f9f9', borderRadius: '4px', fontSize: '14px' }}
      >
        <strong>Текущее состояние:</strong> Шаг {currentStep} из {totalSteps}
      </div>
    </div>
  );
};

export const InteractiveStepper: Story = {
  render: () => <InteractiveStepperComponent />,
};

/**
 * Форма с валидацией на каждом шаге
 */
const WithValidationComponent = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const totalSteps = 3;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Имя должно содержать минимум 2 символа';
      }
    } else if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) {
        newErrors.email = 'Введите корректный email';
      }
    } else if (step === 3) {
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать минимум 6 символов';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      alert('Форма успешно отправлена!\n' + JSON.stringify(formData, null, 2));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <StandaloneStepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        customText={(c, t) => {
          const stepNames = ['Личные данные', 'Email', 'Пароль'];
          return `${stepNames[c - 1]} (${c}/${t})`;
        }}
      />

      <div
        style={{
          padding: '24px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        {currentStep === 1 && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Ваше имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${errors.name ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Введите ваше имя"
            />
            {errors.name && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                {errors.name}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Email адрес
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Пароль
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
              placeholder="Минимум 6 символов"
            />
            {errors.password && (
              <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: currentStep === 1 ? '#f5f5f5' : '#fff',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          ← Назад
        </button>

        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              background: '#007bff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Далее →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              background: '#28a745',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ✓ Отправить
          </button>
        )}
      </div>
    </div>
  );
};

export const WithValidation: Story = {
  render: () => <WithValidationComponent />,
};

/**
 * Автоматическое переключение шагов (симуляция загрузки)
 */
const AutoProgressComponent = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isRunning, setIsRunning] = React.useState(false);
  const totalSteps = 5;

  const startAutoProgress = () => {
    setIsRunning(true);
    setCurrentStep(1);
  };

  React.useEffect(() => {
    if (isRunning && currentStep < totalSteps) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep === totalSteps) {
      setIsRunning(false);
    }
  }, [currentStep, isRunning]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        maxWidth: '600px',
      }}
    >
      <StandaloneStepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        customText={(c, t) => {
          const stepNames = [
            'Инициализация',
            'Загрузка данных',
            'Обработка',
            'Валидация',
            'Завершение',
          ];
          return `${stepNames[c - 1]}... (${c}/${t})`;
        }}
      />

      <button
        onClick={startAutoProgress}
        disabled={isRunning}
        style={{
          padding: '12px 24px',
          borderRadius: '4px',
          border: 'none',
          background: isRunning ? '#6c757d' : '#007bff',
          color: '#fff',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          opacity: isRunning ? 0.6 : 1,
        }}
      >
        {isRunning
          ? '⏳ Выполняется...'
          : currentStep === totalSteps
            ? '✓ Готово! Запустить заново'
            : '▶ Запустить процесс'}
      </button>

      {currentStep === totalSteps && (
        <div
          style={{
            padding: '16px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
          }}
        >
          ✓ Процесс завершён успешно!
        </div>
      )}
    </div>
  );
};

export const AutoProgress: Story = {
  render: () => <AutoProgressComponent />,
};
