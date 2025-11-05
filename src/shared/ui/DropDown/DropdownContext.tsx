import React from 'react';
import { DropdownContext } from './context';
import type { DropdownContextValue } from './Dropdown.types';

export const DropdownProvider: React.FC<{
  value: DropdownContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
};
