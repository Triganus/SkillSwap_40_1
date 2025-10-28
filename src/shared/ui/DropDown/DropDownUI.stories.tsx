import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DropDownUI } from './DropDownUI';

const meta: Meta<typeof DropDownUI> = {
  title: 'Shared/UI/DropDown',
  component: DropDownUI,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Пример с 5 опциями (как в требованиях)
const options5 = [
  { value: '1', label: 'Опция 1' },
  { value: '2', label: 'Опция 2' },
  { value: '3', label: 'Опция 3' },
  { value: '4', label: 'Опция 4' },
  { value: '5', label: 'Опция 5' },
];

const DefaultComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '300px' }}>
      <DropDownUI
        options={options5}
        value={value}
        onChange={setValue}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        placeholder="Выберите опцию"
        label="Выберите значение"
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const WithDefaultValueComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ width: '300px' }}>
      <DropDownUI
        options={options5}
        defaultValue="2"
        onChange={(v) => console.log(v)}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        placeholder="Выберите опцию"
        label="Выберите значение"
      />
    </div>
  );
};

export const WithDefaultValue: Story = {
  render: () => <WithDefaultValueComponent />,
};

const SmallComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={setValue}
      size="small"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      placeholder="Выберите опцию"
      label="Маленький размер"
    />
  );
};

export const Small: Story = {
  render: () => <SmallComponent />,
};

const LargeComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={setValue}
      size="large"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      placeholder="Выберите опцию"
      label="Большой размер"
    />
  );
};

export const Large: Story = {
  render: () => <LargeComponent />,
};

const RequiredComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <DropDownUI
      options={options5}
      value={value}
      onChange={setValue}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      placeholder="Выберите опцию"
      label="Обязательное поле"
      required
    />
  );
};

export const Required: Story = {
  render: () => <RequiredComponent />,
};

const WithErrorComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropDownUI
      options={options5}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      placeholder="Выберите опцию"
      label="С ошибкой"
      error
      errorMessage="Поле обязательно для заполнения"
    />
  );
};

export const WithError: Story = {
  render: () => <WithErrorComponent />,
};

const DisabledComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropDownUI
      options={options5}
      defaultValue="3"
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      placeholder="Выберите опцию"
      label="Отключенный"
      disabled
    />
  );
};

export const Disabled: Story = {
  render: () => <DisabledComponent />,
};

const FullWidthComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '500px' }}>
      <DropDownUI
        options={options5}
        value={value}
        onChange={setValue}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        placeholder="Выберите опцию"
        label="На всю ширину"
        fullWidth
      />
    </div>
  );
};

export const FullWidth: Story = {
  render: () => <FullWidthComponent />,
};
