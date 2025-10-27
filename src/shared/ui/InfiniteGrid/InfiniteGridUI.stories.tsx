import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InfiniteGridUI } from './InfiniteGridUI';

const meta: Meta<typeof InfiniteGridUI> = {
  title: 'Shared/UI/InfiniteGrid',
  component: InfiniteGridUI,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      description: 'Карточки для отображения в сетке',
    },
    onLoadMore: {
      action: 'loadMore',
      description: 'Колбэк при скролле вниз для загрузки новых данных',
    },
    hasMore: {
      control: 'boolean',
      description: 'Есть ли еще данные для загрузки',
    },
    loading: {
      control: 'boolean',
      description: 'Идет ли загрузка данных',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Моковая карточка для примера
const Card = ({ id, title }: { id: number; title: string }) => (
  <div
    style={{
      padding: '24px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '120px',
        background: 'linear-gradient(135deg, #ABD27A 0%, #9BC168 100%)',
        borderRadius: '8px',
      }}
    />
    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Карточка #{id}</p>
  </div>
);

export const Default: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
    )),
    hasMore: false,
    loading: false,
  },
};

export const WithLoading: Story = {
  args: {
    children: Array.from({ length: 9 }, (_, i) => (
      <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
    )),
    hasMore: true,
    loading: true,
  },
};

const InteractiveComponent = () => {
  const [items, setItems] = useState(12);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Имитация загрузки данных
    setTimeout(() => {
      setItems((prev) => {
        const newTotal = prev + 6;
        // Ограничим максимум 36 карточками для демо
        if (newTotal >= 36) {
          setHasMore(false);
        }
        return newTotal;
      });
      setLoading(false);
    }, 1500);
  }, [loading, hasMore]);

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <InfiniteGridUI onLoadMore={handleLoadMore} hasMore={hasMore} loading={loading}>
        {Array.from({ length: items }, (_, i) => (
          <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
        ))}
      </InfiniteGridUI>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};

export const CustomColumns: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
    )),
    columns: {
      mobile: 1,
      tablet: 3,
      desktop: 4,
    },
    hasMore: false,
    loading: false,
  },
};

export const CustomGap: Story = {
  args: {
    children: Array.from({ length: 12 }, (_, i) => (
      <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
    )),
    gap: '16px',
    hasMore: false,
    loading: false,
  },
};

export const SmallGrid: Story = {
  args: {
    children: Array.from({ length: 6 }, (_, i) => (
      <Card key={i} id={i + 1} title={`Навык ${i + 1}`} />
    )),
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 6,
    },
    gap: '12px',
    hasMore: true,
    loading: false,
  },
};

export const EmptyState: Story = {
  args: {
    children: (
      <div
        style={{
          gridColumn: '1 / -1',
          padding: '60px 20px',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1f2937' }}>
          Навыков пока нет
        </h3>
        <p style={{ margin: 0 }}>Начните добавлять навыки для обмена</p>
      </div>
    ),
    hasMore: false,
    loading: false,
  },
};
