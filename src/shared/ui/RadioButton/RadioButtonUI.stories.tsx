import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioButtonUI } from './RadioButtonUI';

const meta: Meta<typeof RadioButtonUI> = {
  title: 'Shared/UI/RadioButton',
  component: RadioButtonUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Имя группы радиокнопок (обязательное для нативных форм)'.trim(),
    },
    value: {
      control: { type: 'text' },
      description: 'Значение элемента'.trim(),
    },
    label: {
      control: { type: 'text' },
      description: 'Видимая подпись. Обязательна при отсутствии ariaLabel'.trim(),
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'Текстовая метка для случаев, когда нет видимой подписи'.trim(),
    },
    checked: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    required: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
      description: 'Размер визуала и шрифта'.trim(),
    },
    fullWidth: { control: { type: 'boolean' } },
    error: { control: { type: 'boolean' } },
    errorMessage: { control: { type: 'text' } },
    className: { control: false },
    ariaDescribedBy: { control: false },
    id: { control: false },
    tabIndex: { control: { type: 'number' } },
    onChange: { action: 'changed' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'level',
    value: 'all',
    label: 'Всё',
    defaultChecked: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <form>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <RadioButtonUI name="sized" value="sm" label="Small" size="sm" defaultChecked />
        <RadioButtonUI name="sized" value="md" label="Medium" size="md" />
        <RadioButtonUI name="sized" value="lg" label="Large" size="lg" />
      </div>
    </form>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid' }}>
      <RadioButtonUI name="state" value="normal" label="Обычное" defaultChecked />
      <RadioButtonUI name="state2" value="disabled" label="Отключено" disabled />
      <RadioButtonUI
        name="state3"
        value="error"
        label="Ошибка"
        error
        errorMessage="Поле обязательно"
      />
    </div>
  ),
};

const ControlledGroupExample = () => {
  const [value, setValue] = useState<string>('learn');

  return (
    <form aria-label="Пример контролируемой группы">
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 8 }}>Чему вы хотите уделить время?</legend>
        <div style={{ display: 'grid' }}>
          <RadioButtonUI
            name="goal"
            value="all"
            label="Всё"
            checked={value === 'all'}
            onChange={(_, v) => setValue(String(v))}
          />
          <RadioButtonUI
            name="goal"
            value="learn"
            label="Хочу научиться"
            checked={value === 'learn'}
            onChange={(_, v) => setValue(String(v))}
          />
          <RadioButtonUI
            name="goal"
            value="teach"
            label="Могу научить"
            checked={value === 'teach'}
            onChange={(_, v) => setValue(String(v))}
          />
        </div>
      </fieldset>
    </form>
  );
};

export const ControlledGroup: Story = {
  render: () => <ControlledGroupExample />,
};

export const WithoutVisibleLabel: Story = {
  args: {
    name: 'ariaOnly',
    value: 'one',
    ariaLabel: 'Только aria-label',
    defaultChecked: true,
  },
};
