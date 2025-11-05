import React from 'react';

export type Option = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type Size = 'small' | 'medium' | 'large';

export type DropdownValue = string | string[];

export type DropdownProps = {
  id?: string;
  label?: string;
  ariaLabel?: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  options?: Option[];
  multiple?: boolean;
  value?: DropdownValue;
  defaultValue?: DropdownValue;
  onChange?: (value: DropdownValue) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  /** отображение выбранных значений в триггере */
  renderDisplay?: (selected: Option[], placeholder: string) => React.ReactNode;
  /** для виртуализации */
  virtualizeThreshold?: number; // порог включения виртуализации
  itemSize?: number; // высота строки для react-window
  menuMaxHeight?: number;
  /**
   * Включить встроенный поиск в поле (вместо поиска внутри меню).
   * По умолчанию: false
   */
  enableSearch?: boolean;
  /** debounce для поиска (мс). По умолчанию 300 */
  searchDebounceMs?: number;
  /**
   * Выравнивание меню по ширине: `content` — под содержимое, `trigger` — по ширине поля.
   * По умолчанию: 'content'
   */
  fit?: 'content' | 'trigger';
  children?: React.ReactNode;
};

export type DropdownContextValue = {
  id: string;
  triggerId: string;
  menuId: string;
  size: Size;
  disabled: boolean;
  required: boolean;
  multiple: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  placeholder: string;
  value: string[]; // нормализованное значение
  setValue: (next: string[]) => void;
  onItemSelect: (val: string) => void;
  options: Option[];
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  getItemId: (i: number) => string;
};
