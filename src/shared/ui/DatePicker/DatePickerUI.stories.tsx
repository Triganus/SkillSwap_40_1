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
      <div style={{ marginTop: '16px', color: '#666' }}>
        {date ? `Выбрана дата: ${date.toLocaleDateString('ru-RU')}` : 'Дата не выбрана'}
      </div>
    </div>
  );
};

const DatePickerWithError = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div style={{ padding: '20px' }}>
      <DatePickerUI
        selectedDate={date}
        onChange={setDate}
        placeholder="дд.мм.гггг"
        maxDate={new Date()}
        error={true}
      />
      <div style={{ marginTop: '8px', color: '#bf3920', fontSize: '14px' }}>
        Поле обязательно для заполнения
      </div>
    </div>
  );
};

type Story = StoryObj<typeof DatePickerUI>;

export const Default: Story = {
  render: () => <DatePickerWithState />,
};

export const BirthDate: Story = {
  render: () => <DatePickerWithState maxDate={new Date()} />,
  parameters: {
    docs: {
      description: {
        story:
          'Календарь с ограничением maxDate=today. Будущие даты заблокированы (перечеркнуты), текущий день выделен жирным и точкой снизу.',
      },
    },
  },
};

export const WithError: Story = {
  render: () => <DatePickerWithError />,
  parameters: {
    docs: {
      description: {
        story: 'Календарь с отображением состояния ошибки (красная граница).',
      },
    },
  },
};
