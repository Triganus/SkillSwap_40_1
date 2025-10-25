import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CheckBoxUI } from './CheckBoxUI.tsx';

const meta: Meta<typeof CheckBoxUI> = {
  title: 'Shared/UI/CheckBox',
  component: CheckBoxUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Имя поля формы (для чекбокса не обязательно)'.trim(),
    },
    value: {
      control: { type: 'text' },
      description: 'Значение, отправляемое при checked=true'.trim(),
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
    defaultChecked: { control: { type: 'boolean' } },
    indeterminate: { control: { type: 'boolean' } },
    hint: { control: { type: 'text' } },
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
    checkedMark: {
      options: ['done', 'remove'],
      control: { type: 'radio' },
      description: 'Вариант визуала при checked: галочка (done) или минус (remove)'.trim(),
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'agree',
    value: 'yes',
    label: 'Согласен с условиями',
    defaultChecked: true,
    hint: 'Можно изменить позже',
  },
};

export const Sizes: Story = {
  render: () => (
    <form>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <CheckBoxUI name="sized" value="sm" label="Small" size="sm" defaultChecked />
        <CheckBoxUI name="sized" value="md" label="Medium" size="md" />
        <CheckBoxUI name="sized" value="lg" label="Large" size="lg" />
      </div>
    </form>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid' }}>
      <CheckBoxUI name="state" value="normal" label="Обычное" defaultChecked />
      <CheckBoxUI name="state2" value="disabled" label="Отключено" disabled />
      <CheckBoxUI
        name="state3"
        value="error"
        label="Ошибка"
        error
        errorMessage="Поле обязательно"
      />
    </div>
  ),
};

const MultiSelectExample = () => {
  const [selected, setSelected] = useState<string[]>(['learn']);
  const toggle = (checked: boolean, v?: string | number) => {
    const val = String(v ?? 'on');
    setSelected((prev) => (checked ? [...prev, val] : prev.filter((x) => x !== val)));
  };
  return (
    <form aria-label="Пример множественного выбора">
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ marginBottom: 8 }}>Темы</legend>
        <div style={{ display: 'grid' }}>
          <CheckBoxUI
            name="topics"
            value="all"
            label="Всё"
            checked={selected.includes('all')}
            onChange={(_, ch, v) => toggle(ch, v)}
          />
          <CheckBoxUI
            name="topics"
            value="learn"
            label="Хочу научиться"
            checked={selected.includes('learn')}
            onChange={(_, ch, v) => toggle(ch, v)}
          />
          <CheckBoxUI
            name="topics"
            value="teach"
            label="Могу научить"
            checked={selected.includes('teach')}
            onChange={(_, ch, v) => toggle(ch, v)}
          />
        </div>
      </fieldset>
      <div style={{ marginTop: 8, fontSize: 12, color: '#69735d' }}>
        Выбрано: {selected.join(', ')}
      </div>
    </form>
  );
};

export const MultiSelect: Story = {
  render: () => <MultiSelectExample />,
};

const TriStateExample = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const allValues = ['all', 'learn', 'teach'];
  const allChecked = selected.length === allValues.length;
  const isIndeterminate = selected.length > 0 && !allChecked;

  const toggleItem = (checked: boolean, v?: string | number) => {
    const val = String(v ?? 'on');
    setSelected((prev) => (checked ? [...prev, val] : prev.filter((x) => x !== val)));
  };
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? allValues : []);
  };

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ marginBottom: 8 }}>Тристейт пример</legend>
      <div style={{ display: 'grid' }}>
        <CheckBoxUI
          label="Выбрать всё"
          checked={allChecked}
          indeterminate={isIndeterminate}
          onChange={(_, ch) => toggleAll(ch)}
        />
        <CheckBoxUI
          name="tri"
          value="all"
          label="Всё"
          checked={selected.includes('all')}
          onChange={(_, ch, v) => toggleItem(ch, v)}
        />
        <CheckBoxUI
          name="tri"
          value="learn"
          label="Хочу научиться"
          checked={selected.includes('learn')}
          onChange={(_, ch, v) => toggleItem(ch, v)}
        />
        <CheckBoxUI
          name="tri"
          value="teach"
          label="Могу научить"
          checked={selected.includes('teach')}
          onChange={(_, ch, v) => toggleItem(ch, v)}
        />
      </div>
    </fieldset>
  );
};

export const TriState: Story = {
  render: () => <TriStateExample />,
};

export const WithoutVisibleLabel: Story = {
  args: {
    name: 'ariaOnly',
    value: 'one',
    ariaLabel: 'Только aria-label',
    defaultChecked: true,
  },
};

export const CheckedMarks: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <CheckBoxUI label="Done" defaultChecked checkedMark="done" />
      <CheckBoxUI label="Remove" defaultChecked checkedMark="remove" />
      <CheckBoxUI label="Indeterminate" indeterminate checkedMark="done" />
    </div>
  ),
};
