import type { Meta, StoryObj } from '@storybook/react';
import { MediaSlider } from '@shared/ui';
import type { MediaItem } from './types';

const demo: MediaItem[] = [
  {
    id: '1',
    src: 'https://fastly.picsum.photos/id/996/324/324.jpg?hmac=n26FtYM1LcDrNAAvu6FehanJ0iTmTMimWrYxY9f5S00',
    alt: 'Drums 1',
  },
  {
    id: '2',
    src: 'https://fastly.picsum.photos/id/441/324/324.jpg?hmac=jHqx8Y1C1cpP-kyZzc9NtY_CxvkCA3AE0rUmNBlQzKg',
    alt: 'Drums 2',
  },
  {
    id: '3',
    src: 'https://fastly.picsum.photos/id/338/324/324.jpg?hmac=VWh-l4AkroMIR9y6PJM7YkghjrWeC2moMpQAAhNHa7U',
    alt: 'Drums 3',
  },
  {
    id: '4',
    src: 'https://fastly.picsum.photos/id/849/324/324.jpg?hmac=6zVo3t7SNVb9tmspvJ1c1jPsjP_WoQWStQ_XuvR5KRE',
    alt: 'Drums 4',
  },
  {
    id: '5',
    src: 'https://fastly.picsum.photos/id/671/324/324.jpg?hmac=XpaARLDNizbD6kqwPfx1PLfW0f_1p4xJNPBs8-_fQcs',
    alt: 'Drums 5',
  },
  {
    id: '6',
    src: 'https://fastly.picsum.photos/id/293/324/324.jpg?hmac=iQ06IlDzfzqAvLW_nQSVYj7UaUH2pLASeeQICsF0N-s',
    alt: 'Drums 6',
  },
  {
    id: '7',
    src: 'https://fastly.picsum.photos/id/874/324/324.jpg?hmac=HzlCEtaz_wDoxlCTMza7dmMFvfNqFPv0ENTyYh-JIe4',
    alt: 'Drums 6',
  },
];

const meta: Meta<typeof MediaSlider> = {
  title: 'Shared/MediaSlider',
  component: MediaSlider,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof MediaSlider>;

export const Default: Story = {
  args: {
    items: demo,
    className: '',
  },
};

export const ThreeItems: Story = {
  args: {
    items: demo.slice(0, 3),
  },
};

export const OneItem: Story = {
  args: {
    items: demo.slice(0, 1),
  },
};
