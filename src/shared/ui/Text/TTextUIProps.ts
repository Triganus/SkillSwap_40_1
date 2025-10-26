import type { ReactNode, CSSProperties } from 'react';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'link';

export interface TTextUIProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  style?: CSSProperties;
}