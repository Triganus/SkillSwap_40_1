import { SearchUI } from '@shared/ui/Search';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchUI> = {
  title: 'UI/SearchUI',
  component: SearchUI,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    value: {
      control: 'text',
      description: 'Current value of the search input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when input value changes',
    },
    onKeyDown: {
      action: 'key pressed',
      description: 'Callback fired when a key is pressed',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when search button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Искать навык',
    value: '',
    disabled: false,
  },
};

export const WithValue: Story = {
  args: {
    placeholder: 'Искать навык',
    value: 'барабаны',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Искать навык',
    value: '',
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Поиск по навыкам...',
    value: '',
    disabled: false,
  },
};

export const LongPlaceholder: Story = {
  args: {
    placeholder: 'Введите название навыка для поиска',
    value: '',
    disabled: false,
  },
};
