import { createContext } from 'react';
import type { DropdownContextValue } from './Dropdown.types';

export const DropdownContext = createContext<DropdownContextValue | null>(null);
