export interface TDatePickerUIProps {
  /**
   * выбранная дата
   */
  selectedDate?: Date;
  /**
   * обработчик выбора даты
   */
  onChange?: (date: Date | undefined) => void;
  /**
   * placeholder для input
   */
  placeholder?: string;
  /**
   * максимальная дата (по умолчанию — сегодня)
   */
  maxDate?: Date;
  /**
   * дополнительный CSS-класс
   */
  className?: string;
}
