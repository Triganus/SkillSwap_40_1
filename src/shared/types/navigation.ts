import type { ReactNode } from 'react';
import type { To } from 'react-router-dom';

export type TNavItemNode =
  | {
      key: string;
      to: To;
      label: ReactNode;
      end?: boolean;
    }
  | {
      key: string;
      node: ReactNode;
    };
