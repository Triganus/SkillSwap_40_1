import type React from 'react';

export interface TCheckBoxUIProps {
  /**
   * Имя поля формы. Для чекбокса не обязательно (локальный boolean),
   * но рекомендуется при работе с формами
   */
  name?: string;
  /**
   * Значение, отправляемое при checked=true. Если не указано — браузер отправит 'on'
   */
  value?: string | number;
  /**
   * Узел видимой метки. Обязателен, когда не предоставлен `ariaLabel`
   */
  label?: React.ReactNode;

  /**
   * Контролируемое состояние. При указании компонент становится контролируемым
   * Используйте вместе с `onChange`
   */
  checked?: boolean;
  /**
   * Неконтролируемое начальное состояние. Взаимоисключающее с `checked`
   */
  defaultChecked?: boolean;

  /**
   * Промежуточное состояние (только визуально). Выставляется как input.indeterminate
   */
  indeterminate?: boolean;

  disabled?: boolean;
  required?: boolean;
  /**
   * Режим только для чтения: блокирует смену состояния, но не отключает фокус
   */
  readOnly?: boolean;

  /**
   * Если не указан, id будет сгенерирован через useId()
   */
  id?: string;

  /**
   * Aria метка для случаев, когда нет видимой метки
   */
  ariaLabel?: string;
  /**
   * id элемента(ов), описывающих контрол (подсказка/описание)
   */
  ariaDescribedBy?: string;

  /**
   * Флаг состояния ошибки. Добавляет стили и aria-invalid
   */
  error?: boolean;
  /**
   * Сообщение об ошибке, озвучиваемое скринридером и отображаемое под меткой
   */
  errorMessage?: React.ReactNode;
  /**
   * Подсказка/описание. Свяжется через aria-describedby
   */
  hint?: React.ReactNode;

  /**
   * Основной обработчик изменений
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value?: string | number
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  className?: string;
  /**
   * Размер визуальных элементов и шрифта
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Растягивает контейнер на всю ширину
   */
  fullWidth?: boolean;
  /**
   * Опциональный tabIndex (обычно не требуется)
   */
  tabIndex?: number;

  /**
   * Вариант отображения при checked: галочка ('done') или минус ('remove').
   * При indeterminate всегда показывается минус
   */
  checkedMark?: 'done' | 'remove';
}
