// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/Dropdown.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import type { Option } from '@shared/ui';

const meta: Meta<typeof Dropdown> = {
  title: 'Shared/UI/Dropdown',
  component: Dropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

function BasicStatesExample() {
  const [open, setOpen] = useState(true);
  const [val, setVal] = useState<string>('sel');
  const options: Option[] = [
    { value: 'sel', label: 'Выбранный вариант' },
    { value: 'hover', label: 'Hover' },
    { value: 'simple', label: 'Просто вариант' },
  ];
  return (
    <div style={{ width: 320 }}>
      <Dropdown
        label="Дропдаун"
        options={options}
        value={val}
        onChange={(v) => setVal(String(v))}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

function WithSearchExample() {
  const cities: Option[] = [
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'sam', label: 'Самара' },
    { value: 'sar', label: 'Саратов' },
    { value: 'msk', label: 'Москва' },
    { value: 'ekb', label: 'Екатеринбург' },
  ];
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 320 }}>
      <Dropdown
        label="Город"
        placeholder="Не указан"
        options={cities}
        value={value}
        onChange={(v) => setValue(String(v))}
        enableSearch
        fit="content"
        searchDebounceMs={300}
      />
    </div>
  );
}

function SingleChoiceExample() {
  const [value, setValue] = useState('');
  const options: Option[] = [
    { value: '', label: 'Не указан' },
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
  ];
  return (
    <div style={{ width: 260 }}>
      <Dropdown
        label="Пол"
        placeholder="Не указан"
        options={options}
        value={value}
        onChange={(v) => setValue(String(v))}
      />
    </div>
  );
}

function MultiSelectExample() {
  const opts: Option[] = [
    { value: 'career', label: 'Бизнес и карьера' },
    { value: 'art', label: 'Творчество и искусство' },
    { value: 'lang', label: 'Иностранные языки' },
    { value: 'health', label: 'Здоровье и лайфстайл' },
    { value: 'home', label: 'Дом и уют' },
  ];
  const [value, setValue] = useState<string[]>([]);
  return (
    <div style={{ width: 360 }}>
      <Dropdown
        label="Категория навыка, которому хотите научиться"
        placeholder="Выберите категорию"
        options={opts}
        multiple
        value={value}
        onChange={(v) => setValue(Array.isArray(v) ? v : [String(v)])}
        fit="content"
      />
    </div>
  );
}

export const BasicStates: Story = {
  name: 'Базовые состояния',
  render: () => <BasicStatesExample />,
};
export const WithSearch: Story = {
  name: 'С поиском (в поле)',
  render: () => <WithSearchExample />,
};
export const SingleChoice: Story = {
  name: 'Одиночный выбор',
  render: () => <SingleChoiceExample />,
};
export const MultiSelect: Story = {
  name: 'Мультиселект с чекбоксами',
  render: () => <MultiSelectExample />,
};
