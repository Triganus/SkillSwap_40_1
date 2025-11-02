// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/Dropdown.types.ts
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
  /** список опций. Можно также отрисовывать свои <Dropdown.Item/> вручную */
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
  query: string;
  setQuery: (q: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  getItemId: (i: number) => string;
};
