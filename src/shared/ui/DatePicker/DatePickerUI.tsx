import { useState, useRef, useEffect, useMemo } from 'react';
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
  error = false,
}: TDatePickerUIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // инициализация текущего месяца/года из selectedDate или сегодня
  const initDate = selectedDate || new Date();
  const [currentMonth, setCurrentMonth] = useState(initDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initDate.getFullYear());

  // временная выбранная дата (до подтверждения)
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(selectedDate);

  // состояние для управления выпадающими списками
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // состояние для клавиатурной навигации
  const [focusedDate, setFocusedDate] = useState<Date | undefined>(undefined);

  // обновляем временную дату при изменении selectedDate извне
  useEffect(() => {
    setTempSelectedDate(selectedDate);
  }, [selectedDate]);

  // обновляем месяц/год при открытии календаря
  useEffect(() => {
    if (isOpen) {
      const dateToShow = selectedDate || new Date();
      setCurrentMonth(dateToShow.getMonth());
      setCurrentYear(dateToShow.getFullYear());
      setTempSelectedDate(selectedDate);
    }
  }, [isOpen, selectedDate]);

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

  // инициализация фокусированной даты при открытии
  useEffect(() => {
    if (isOpen) {
      const initialFocus = tempSelectedDate || new Date();
      setFocusedDate(initialFocus);
    } else {
      setFocusedDate(undefined);
    }
  }, [isOpen, tempSelectedDate]);

  // клавиатурная навигация
  useEffect(() => {
    if (!isOpen || !focusedDate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Если открыты дропдауны, не обрабатываем навигацию по дням
      if (isMonthDropdownOpen || isYearDropdownOpen) return;

      const newDate = new Date(focusedDate);

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          newDate.setDate(newDate.getDate() - 1);
          setFocusedDate(newDate);
          // Переключаем месяц если нужно
          if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          newDate.setDate(newDate.getDate() + 1);
          setFocusedDate(newDate);
          if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          newDate.setDate(newDate.getDate() - 7);
          setFocusedDate(newDate);
          if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          newDate.setDate(newDate.getDate() + 7);
          setFocusedDate(newDate);
          if (newDate.getMonth() !== currentMonth || newDate.getFullYear() !== currentYear) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedDate <= maxDate) {
            setTempSelectedDate(focusedDate);
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleCancel();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    focusedDate,
    currentMonth,
    currentYear,
    isMonthDropdownOpen,
    isYearDropdownOpen,
    maxDate,
  ]);

  // генерация 42 ячеек календаря (6 недель) с мемоизацией
  const days = useMemo((): DayItem[] => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const result: DayItem[] = [];

    // дни предыдущего месяца
    for (let i = 0; i < adjustedFirstDay; i++) {
      const day = daysInPrevMonth - adjustedFirstDay + 1 + i;
      const date = new Date(currentYear, currentMonth - 1, day);
      result.push({ date, isCurrent: false, disabled: date > maxDate });
    }

    // дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      result.push({ date, isCurrent: true, disabled: date > maxDate });
    }

    // дни следующего месяца (до 42)
    while (result.length < 42) {
      const day = result.length - daysInMonth - adjustedFirstDay + 1;
      const date = new Date(currentYear, currentMonth + 1, day);
      result.push({ date, isCurrent: false, disabled: date > maxDate });
    }

    return result;
  }, [currentYear, currentMonth, maxDate]);

  const handleDateClick = (date: Date, disabled: boolean) => {
    if (disabled) return;
    setTempSelectedDate(date);
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

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onChange?.(tempSelectedDate);
    setIsOpen(false);
  };

  const formatDate = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Проверка, является ли дата сегодняшней
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // генерируем список лет
  const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);

  return (
    <div className={`${styles.datePickerWrapper} ${className}`} ref={wrapperRef}>
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
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
                          className={idx === currentMonth ? styles.selected : ''}
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
                          className={year === currentYear ? styles.selected : ''}
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
              {days.map((item) => {
                const isSelectedDay =
                  tempSelectedDate && item.date.toDateString() === tempSelectedDate.toDateString();
                const isTodayDay = isToday(item.date);
                const isFocusedDay =
                  focusedDate && item.date.toDateString() === focusedDate.toDateString();

                return (
                  <div
                    key={item.date.getTime()}
                    className={`${styles.day} ${!item.isCurrent ? styles.dayOutside : ''} ${
                      isSelectedDay ? styles.selectedDay : ''
                    } ${isTodayDay ? styles.today : ''} ${item.disabled ? styles.disabledDay : ''} ${
                      isFocusedDay ? styles.focusedDay : ''
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.dayButton}
                      disabled={item.disabled}
                      onClick={() => handleDateClick(item.date, item.disabled)}
                      onMouseEnter={() => setFocusedDate(item.date)}
                      aria-label={`${item.date.getDate()} ${MONTHS[item.date.getMonth()]} ${item.date.getFullYear()}`}
                    >
                      {item.date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.buttons}>
            <Button onClick={handleCancel}>Отменить</Button>
            <Button onClick={handleConfirm}>Выбрать</Button>
          </div>
        </div>
      )}
    </div>
  );
};
