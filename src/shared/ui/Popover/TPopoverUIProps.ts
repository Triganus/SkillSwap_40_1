import type { ReactNode } from 'react';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TPopoverUIProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: PopoverPosition;
  className?: string;
  anchorEl?: HTMLElement | null;
}
