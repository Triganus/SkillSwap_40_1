import type { CSSProperties, ReactNode } from 'react';
import type { TCheckBoxUIProps } from '@shared/ui';
import type { SkillCategory } from '@/entities/Skill';
export interface TAccordionUIProps {
  /** Заголовок категории (передаётся также в label чекбокса, если label не задан) */
  title: string;
  /** Контент (подкатегории и т.д.) */
  children?: ReactNode;

  /** Открыт ли аккордеон (неконтролируемый) */
  defaultOpen?: boolean;
  /** Контролируемое состояние */
  isOpen?: boolean;

  onToggle?: (open: boolean) => void;

  /** Пропсы для CheckBoxUI */
  checkboxProps?: Omit<TCheckBoxUIProps, 'label' | 'id'>;
  data: SkillCategory;
  /** Выбранные значения (управляемый режим - обязательно) */
  selectedValues: (string | number)[];
  /** Стилизация */
  onSelectChange?: (category: string, selectedSkills: (string | number)[]) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  forceChevron?: boolean; //
  id?: string;
}
