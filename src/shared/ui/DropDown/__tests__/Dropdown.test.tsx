// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/__tests__/Dropdown.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from '../Dropdown';

const options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
  { value: '3', label: 'Three' },
];

describe('Dropdown', () => {
  it('opens and selects single item', () => {
    const onChange = vi.fn();
    render(<Dropdown label="Label" options={options} onChange={onChange} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Two' }));
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it('multi-select keeps menu open and counts selection', () => {
    const onChange = vi.fn();
    render(<Dropdown label="Label" options={options} onChange={onChange} multiple />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    fireEvent.click(screen.getByRole('option', { name: 'Two' }));
    expect(onChange).toHaveBeenCalledWith(['2']);
    // меню остаётся открытым
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
