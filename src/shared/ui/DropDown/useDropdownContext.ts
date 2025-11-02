// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/useDropdownContext.ts
import { useContext } from 'react';
import { DropdownContext } from './context';

export const useDropdownContext = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error('Dropdown compound components must be used within <Dropdown>');
  return ctx;
};
