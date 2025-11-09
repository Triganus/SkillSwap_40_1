import type { ReactNode, MouseEvent, ReactElement, RefObject } from 'react';
import type { IconProps } from '../Icon';

export type ActionId = string & { readonly __brand?: 'ActionId' };

export type BaseAction = {
  id: ActionId;
  ariaLabel?: string;
  hint?: string;
  className?: string;
  /** Показывать ли индикатор (красная точка), например, для новых уведомлений */
  hasIndicator?: boolean;
  /** Выпадающее меню/контент */
  dropdown?: ReactNode;
};

export type IconAction = BaseAction & {
  kind: 'button';
  icon: ReactElement<IconProps>;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  badgeContent?: string;
};

export type CustomAction = BaseAction & {
  kind: 'custom';
  node: ReactNode;
};

export type ActionItem = IconAction | CustomAction;

export interface ActionsProps {
  items: ActionItem[];
  className?: string;
}
