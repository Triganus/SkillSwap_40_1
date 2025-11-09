import type { Meta, StoryObj } from '@storybook/react';
import { CitiesSideBar } from './CitiesSideBar';
import { CitiesSideBarWithOutput } from './CitiesSideBarWithOutput';
import type { City } from '@/entities/directory/model/types';

const meta: Meta<typeof CitiesSideBar> = {
  title: 'Shared/CitiesSideBar',
  component: CitiesSideBar,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

const SAMPLE: City[] = [
  { id: 'city_msk', name: 'Москва' },
  { id: 'city_spb', name: 'Санкт-Петербург' },
  { id: 'city_nsk', name: 'Новосибирск' },
  { id: 'city_ekb', name: 'Екатеринбург' },
  { id: 'city_kzn', name: 'Казань' },
  { id: 'city_nnov', name: 'Нижний Новгород' },
  { id: 'city_chel', name: 'Челябинск' },
  { id: 'city_sam', name: 'Самара' },
];

type Story = StoryObj<typeof CitiesSideBar>;

export const WithOutputBelow: Story = {
  args: {
    title: 'Города',
    cities: SAMPLE,
    value: [],
  },
  render: (args) => <CitiesSideBarWithOutput {...args} defaultSelected={['city_kzn', 'city_spb']} />,
};
