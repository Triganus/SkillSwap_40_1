import { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import type { TDatePickerUIProps } from './TDatePickerUIProps';
import styles from './DatePickerUI.module.scss';

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

interface DayItem {
  date: Date;
  isCurrent: boolean;
  disabled: boolean;
}

export const DatePickerUI = ({
  selectedDate,
  onChange,
  placeholder = 'дд.мм.гггг',
  maxDate = new Date(),
  className = '',
}: TDatePickerUIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // инициализация текущего месяца/года из selectedDate или сегодня
  const initDate = selectedDate || new Date();
  const [currentMonth, setCurrentMonth] = useState(initDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initDate.getFullYear());

  // состояние для управления выпадающими списками
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsMonthDropdownOpen(false);
        setIsYearDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // генерация 42 ячеек календаря (6 недель)
  const generateDays = (): DayItem[] => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: DayItem[] = [];

    // дни предыдущего месяца
    for (let i = 0; i < adjustedFirstDay; i++) {
      const day = daysInPrevMonth - adjustedFirstDay + 1 + i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({ date, isCurrent: false, disabled: date > maxDate });
    }

    // дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ date, isCurrent: true, disabled: date > maxDate });
    }

    // дни следующего месяца (до 42)
    while (days.length < 42) {
      const day = days.length - daysInMonth - adjustedFirstDay + 1;
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({ date, isCurrent: false, disabled: date > maxDate });
    }

    return days;
  };

  const handleDateClick = (date: Date, disabled: boolean) => {
    if (disabled) return;
    onChange?.(date);
    setIsOpen(false);
  };

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    setIsMonthDropdownOpen(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setIsYearDropdownOpen(false);
  };

  const toggleMonthDropdown = () => {
    setIsMonthDropdownOpen((prev) => !prev);
    setIsYearDropdownOpen(false); // закрываем год, если открыт
  };

  const toggleYearDropdown = () => {
    setIsYearDropdownOpen((prev) => !prev);
    setIsMonthDropdownOpen(false); // закрываем месяц, если открыт
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // генерируем список лет
  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);

  return (
    <div className={`${styles.datePickerWrapper} ${className}`} ref={wrapperRef}>
      <div className={styles['input-wrapper']}>
        <input
          type="text"
          readOnly
          className={styles.input}
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          onClick={() => setIsOpen(true)}
        />
        <button
          type="button"
          className={styles.iconButtonInside}
          onClick={() => setIsOpen(true)}
          aria-label="Открыть календарь"
        >
          <Icon name="calendar" size={24} />
        </button>
      </div>

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.header}>
            <div className={styles.dropdowns}>
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.monthButton}
                  aria-expanded={isMonthDropdownOpen}
                  aria-haspopup="listbox"
                >
                  {MONTHS[currentMonth]}
                </button>
                <button
                  type="button"
                  className={styles.chevronButton}
                  onClick={toggleMonthDropdown}
                  aria-label="Выбрать месяц"
                >
                  <Icon name="chevron-down" size={24} />
                </button>

                {isMonthDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <ul role="listbox">
                      {MONTHS.map((month, idx) => (
                        <li
                          key={idx}
                          role="option"
                          className={`${styles.dropdownItem} ${
                            idx === currentMonth ? styles.selected : ''
                          }`}
                          onClick={() => handleMonthChange(idx)}
                          aria-selected={idx === currentMonth}
                        >
                          {month}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.yearButton}
                  aria-expanded={isYearDropdownOpen}
                  aria-haspopup="listbox"
                >
                  {currentYear}
                </button>
                <button
                  type="button"
                  className={styles.chevronButton}
                  onClick={toggleYearDropdown}
                  aria-label="Выбрать год"
                >
                  <Icon name="chevron-down" size={24} />
                </button>

                {isYearDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <ul role="listbox">
                      {years.map((year) => (
                        <li
                          key={year}
                          role="option"
                          className={`${styles.dropdownItem} ${
                            year === currentYear ? styles.selected : ''
                          }`}
                          onClick={() => handleYearChange(year)}
                          aria-selected={year === currentYear}
                        >
                          {year}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.weekNames}>
            {WEEK_DAYS.map((day, i) => (
              <div key={i} className={styles.day}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.calendarField}>
            <div className={styles.days}>
              {generateDays().map((item, idx) => (
                <div
                  key={idx}
                  className={`${styles.day} ${!item.isCurrent ? styles.dayOutside : ''} ${
                    selectedDate && item.date.toDateString() === selectedDate.toDateString()
                      ? styles.selectedDay
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    className={styles.dayButton}
                    disabled={item.disabled}
                    onClick={() => handleDateClick(item.date, item.disabled)}
                  >
                    {item.date.getDate()}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              className={styles.cancelButton}
              onClick={() => setIsOpen(false)}
            >
              Отменить
            </Button>
            <Button
              className={styles.selectButton}
              onClick={() => setIsOpen(false)}
            >
              Выбрать
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
