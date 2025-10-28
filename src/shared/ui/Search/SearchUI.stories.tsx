import { SearchUI } from '@shared/ui/Search';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@shared/ui/Icon';
import type { SearchUIProps } from '@shared/ui/Search';

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
    prefix: { control: false },
    suffix: { control: false },
  },
};

export default meta;
export type Story = StoryObj<typeof meta>;

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

export const WithPrefix: Story = {
  render: (args: SearchUIProps) => (
    <SearchUI
      {...args}
      placeholder="Искать навык"
      prefix={<Icon name="search" size={24} title="Поиск" />}
    />
  ),
};

export const WithSuffix: Story = {
  render: (args: SearchUIProps) => (
    <SearchUI
      {...args}
      placeholder="Искать навык"
      suffix={<Icon name="cross" size={24} title="Очистить" />}
    />
  ),
};
