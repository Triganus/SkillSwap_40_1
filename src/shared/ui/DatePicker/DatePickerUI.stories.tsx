import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePickerUI } from './DatePickerUI';
import 'react-datepicker/dist/react-datepicker.css';

const meta: Meta<typeof DatePickerUI> = {
  title: 'Shared/DatePicker',
  component: DatePickerUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// вспомогательный компонент для стори
const DatePickerWithState = ({ maxDate }: { maxDate?: Date }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div style={{ padding: '20px' }}>
      <DatePickerUI
        selectedDate={date}
        onChange={setDate}
        placeholder="дд.мм.гггг"
        maxDate={maxDate}
      />
    </div>
  );
};

type Story = StoryObj<typeof DatePickerUI>;

export const Default: Story = {
  render: () => <DatePickerWithState />,
};

export const BirthDate: Story = {
  render: () => <DatePickerWithState maxDate={new Date()} />,
};
