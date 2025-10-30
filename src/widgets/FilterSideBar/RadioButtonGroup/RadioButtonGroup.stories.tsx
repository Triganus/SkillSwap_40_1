import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioButtonGroup } from './RadioButtonGroup';

const WithValueDisplay = ({
  title,
  items,
  name,
  defaultValue,
}: {
  title?: string;
  items: string[];
  name?: string;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <RadioButtonGroup
        title={title}
        items={items}
        name={name}
        defaultValue={defaultValue}
        onChange={(val) => setValue(val)}
      />
      <div style={{ fontSize: 14, color: '#555' }}>
        <strong>Выбрано:</strong> {value || '—'}
      </div>
    </div>
  );
};

const meta: Meta<typeof RadioButtonGroup> = {
  title: 'Filters/RadioButtonGroup',
  component: RadioButtonGroup,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  render: () => (
    <WithValueDisplay
      name="learn-mode"
      items={['Всё', 'Хочу научиться', 'Могу научить']}
      defaultValue="Хочу научиться"
    />
  ),
};


export const WithTitle: Story = {
  render: () => (
    <WithValueDisplay
      title="Пол автора"
      name="author-gender"
      items={['Не имеет значения', 'Мужской', 'Женский']}
      defaultValue="Не имеет значения"
    />
  ),
};
