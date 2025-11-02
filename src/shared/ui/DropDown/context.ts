// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/context.ts
import { createContext } from 'react';
import type { DropdownContextValue } from './Dropdown.types';

export const DropdownContext = createContext<DropdownContextValue | null>(null);

