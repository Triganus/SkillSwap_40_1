import type { ReactNode } from 'react';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface TModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ModalAction[];
  className?: string;
}
