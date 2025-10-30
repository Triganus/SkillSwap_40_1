import type { ReactNode, CSSProperties } from 'react';

export type TextVariant = 'body' | 'caption';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'link';

export interface TTextUIProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  style?: CSSProperties;
}
