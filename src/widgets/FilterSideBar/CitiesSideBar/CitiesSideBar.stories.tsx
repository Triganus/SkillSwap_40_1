import type { Meta, StoryObj } from '@storybook/react';
import { CitiesSideBar } from './CitiesSideBar';
import { CitiesSideBarWithOutput } from './CitiesSideBarWithOutput';

const meta: Meta<typeof CitiesSideBar> = {
  title: 'Shared/CitiesSideBar',
  component: CitiesSideBar,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

const SAMPLE: string[] = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
];

type Story = StoryObj<typeof CitiesSideBar>;

export const WithOutputBelow: Story = {
  args: {
    title: 'Города',
    cities: SAMPLE,
    defaultSelected: ['Казань', 'Санкт-Петербург'],
  },
  render: (args) => <CitiesSideBarWithOutput {...args} />,
};
