/**
 * Преобразует строку формата дд.мм.гггг в объект Date
 */
export function parseDateFromString(dateStr: string): Date | undefined {
  if (!dateStr || typeof dateStr !== 'string') return undefined;

  const parts = dateStr.split('.');
  if (parts.length !== 3) return undefined;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined;

  const date = new Date(year, month - 1, day);

  // Проверяем, что дата валидна
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return undefined;
  }

  return date;
}

/**
 * Форматирует объект Date в строку формата дд.мм.гггг
 */
export function formatDateToString(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
