import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DropDownUI } from '.';

const meta: Meta<typeof DropDownUI> = {
  title: 'Shared/UI/DropDown (alias) ',
  component: DropDownUI,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const options5 = [
  { value: '1', label: 'Опция 1' },
  { value: '2', label: 'Опция 2' },
  { value: '3', label: 'Опция 3' },
  { value: '4', label: 'Опция 4' },
  { value: '5', label: 'Опция 5' },
];

const DefaultComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div style={{ width: 300 }}>
      <DropDownUI
        options={options5}
        value={value}
        onChange={(v) => setValue(String(v))}
        open={open}
        onOpenChange={setOpen}
        placeholder="Выберите опцию"
        label="Выберите значение"
      />
    </div>
  );
};
export const Default: Story = { render: () => <DefaultComponent /> };

const WithDefaultValueComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: 300 }}>
      <DropDownUI
        options={options5}
        defaultValue="2"
        open={open}
        onOpenChange={setOpen}
        placeholder="Выберите опцию"
        label="Выберите значение"
      />
    </div>
  );
};
export const WithDefaultValue: Story = { render: () => <WithDefaultValueComponent /> };

const SmallComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={(v) => setValue(String(v))}
      size="small"
      open={open}
      onOpenChange={setOpen}
      placeholder="Выберите опцию"
      label="Маленький размер"
    />
  );
};
export const Small: Story = { render: () => <SmallComponent /> };

const LargeComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={(v) => setValue(String(v))}
      size="large"
      open={open}
      onOpenChange={setOpen}
      placeholder="Выберите опцию"
      label="Большой размер"
    />
  );
};
export const Large: Story = { render: () => <LargeComponent /> };

const RequiredComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={(v) => setValue(String(v))}
      open={open}
      onOpenChange={setOpen}
      placeholder="Выберите опцию"
      label="Обязательное поле"
      required
    />
  );
};
export const Required: Story = { render: () => <RequiredComponent /> };

const WithErrorComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownUI
      options={options5}
      open={open}
      onOpenChange={setOpen}
      placeholder="Выберите опцию"
      label="С ошибкой"
      error
      errorMessage="Поле обязательно для заполнения"
    />
  );
};
export const WithError: Story = { render: () => <WithErrorComponent /> };

const DisabledComponent = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownUI
      options={options5}
      defaultValue="3"
      open={open}
      onOpenChange={setOpen}
      placeholder="Выберите опцию"
      label="Отключенный"
      disabled
    />
  );
};
export const Disabled: Story = { render: () => <DisabledComponent /> };

const FullWidthComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div style={{ width: 500 }}>
      <DropDownUI
        options={options5}
        value={value}
        onChange={(v) => setValue(String(v))}
        open={open}
        onOpenChange={setOpen}
        placeholder="Выберите опцию"
        label="На всю ширину"
        fullWidth
      />
    </div>
  );
};
export const FullWidth: Story = { render: () => <FullWidthComponent /> };
