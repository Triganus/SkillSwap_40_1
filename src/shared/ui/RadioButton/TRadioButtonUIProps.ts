import type React from 'react';

export interface TRadioButtonUIProps {
  /**
   * Имя группы радиокнопок
   */
  name: string;
  /**
   *  Значение элемента радиокнопки
   */
  value: string | number;
  /**
   *  Узел видимой метки. Обязателен, когда не предоставлен `ariaLabel`
   */
  label?: React.ReactNode;

  /**
   * Контролируемое состояние выбора. При указании компонент становится контролируемым
   * Используйте вместе с `onChange`
   */
  checked?: boolean;
  /**
   * Неконтролируемое начальное состояние выбора. Взаимоисключающее с `checked`
   */
  defaultChecked?: boolean;

  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;

  /**
   *  Если не указан, id будет сгенерирован через useId()
   */
  id?: string;

  /**
   * Aria метка для случаев, когда нет видимой метки
   */
  ariaLabel?: string;
  /**
   *  id элемента, который описывает контрол (подсказка или дополнительное описание)
   */
  ariaDescribedBy?: string;

  /**
   *  Флаг состояния ошибки. Добавляет стили и aria-invalid
   */
  error?: boolean;
  /**
   *  Опциональное сообщение об ошибке, отображаемое под меткой и озвучиваемое скринридером
   */
  errorMessage?: React.ReactNode;

  /**
   *  Основной обработчик изменений, вызываемый при изменении нативного input
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  className?: string;
  /**
   *  Размер визуальных элементов контрола и шрифта
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   *  Растягивает контейнер на полную ширину
   */
  fullWidth?: boolean;
  /**
   *  Опциональный tabIndex
   */
  tabIndex?: number;
}
