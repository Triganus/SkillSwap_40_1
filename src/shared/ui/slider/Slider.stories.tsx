import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

type Item = { id: string; title: string };

const data: Item[] = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  title: `Карточка ${i + 1}`,
}));

const meta: Meta<typeof Slider<Item>> = {
  title: 'Shared/Slider',
  component: Slider<Item>,
  args: {
    data,
    slidesPerView: 'auto',
    spaceBetween: 16,
    showArrows: true,
    renderItem: (item: Item) => (
      <div
        style={{
          width: 240,
          height: 160,
          borderRadius: 12,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.title}
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const OnePerView: Story = {
  args: {
    slidesPerView: 1,
    spaceBetween: 16,
  },
};
