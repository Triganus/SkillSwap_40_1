import type { ReactNode } from 'react';

export interface TInfiniteGridUIProps {
  children: ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}
