import type { Meta, StoryObj } from '@storybook/react';
import { TwoColumnLayout } from '@shared/ui';

const meta: Meta<typeof TwoColumnLayout> = {
  title: 'Shared/TwoColumnLayout',
  component: TwoColumnLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Универсальный компонент для создания макета из двух равноширинных блоков. Автоматически адаптируется под мобильные устройства.',
      },
    },
  },
  argTypes: {
    gap: {
      control: { type: 'number', min: 0, max: 100, step: 4 },
      description: 'Расстояние между блоками',
    },
    columnPadding: {
      control: { type: 'number', min: 0, max: 100, step: 4 },
      description: 'Padding внутри блоков',
    },
    columnBackground: {
      control: 'color',
      description: 'Цвет фона блоков',
    },
    containerBackground: {
      control: 'color',
      description: 'Цвет фона контейнера',
    },
    containerPadding: {
      control: { type: 'number', min: 0, max: 100, step: 4 },
      description: 'Padding контейнера',
    },
    borderRadius: {
      control: { type: 'number', min: 0, max: 32, step: 4 },
      description: 'Скругление углов блоков',
    },
    breakpoint: {
      control: { type: 'number', min: 320, max: 1200, step: 48 },
      description: 'Breakpoint для адаптивности (px)',
    },
    columnJustify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
      description: 'Выравнивание по вертикали',
    },
    columnAlign: {
      control: 'select',
      options: ['stretch', 'flex-start', 'center', 'flex-end'],
      description: 'Выравнивание по горизонтали',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TwoColumnLayout>;

// Базовый пример
export const Default: Story = {
  args: {
    leftContent: (
      <div>
        <h2>Левый блок</h2>
        <p>Это контент левого блока. Здесь может быть любой контент.</p>
      </div>
    ),
    rightContent: (
      <div>
        <h2>Правый блок</h2>
        <p>Это контент правого блока. Здесь тоже может быть любой контент.</p>
      </div>
    ),
  },
};

// С разным количеством контента
export const UnequalContent: Story = {
  args: {
    leftContent: (
      <div>
        <h2>Короткий контент</h2>
        <p>Минимум текста.</p>
      </div>
    ),
    rightContent: (
      <div>
        <h2>Длинный контент</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Блоки автоматически выравниваются по высоте, даже если контент разный.',
      },
    },
  },
};

// Центрированный контент
export const CenteredContent: Story = {
  args: {
    leftContent: (
      <div style={{ textAlign: 'center' }}>
        <h2>Центрированный</h2>
        <p>Контент выровнен по центру</p>
      </div>
    ),
    rightContent: (
      <div style={{ textAlign: 'center' }}>
        <h2>Тоже центр</h2>
        <p>Вертикально и горизонтально</p>
      </div>
    ),
    columnJustify: 'center',
    columnAlign: 'center',
    minHeight: '500px',
  },
};

// Полноэкранный макет
export const Fullscreen: Story = {
  args: {
    leftContent: (
      <div>
        <h1>Полноэкранный макет</h1>
        <p>Занимает всю высоту viewport.</p>
      </div>
    ),
    rightContent: (
      <div>
        <h2>Второй блок</h2>
        <p>Также на всю высоту экрана.</p>
      </div>
    ),
    minHeight: '100vh',
    columnJustify: 'center',
  },
};

// С кастомными классами
export const WithCustomClasses: Story = {
  args: {
    leftContent: <div>Левый блок с кастомным классом</div>,
    rightContent: <div>Правый блок с кастомным классом</div>,
    leftColumnClassName: 'custom-left',
    rightColumnClassName: 'custom-right',
    className: 'custom-container',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Можно добавить кастомные CSS классы для дополнительной стилизации отдельных блоков.',
      },
    },
  },
};

// Адаптивный breakpoint
export const CustomBreakpoint: Story = {
  args: {
    leftContent: (
      <div>
        <h2>Breakpoint: 992px</h2>
        <p>Блоки переключатся в вертикальную раскладку на планшетах.</p>
      </div>
    ),
    rightContent: (
      <div>
        <h2>Адаптивность</h2>
        <p>Измените ширину окна, чтобы увидеть эффект.</p>
      </div>
    ),
    breakpoint: 992,
    containerBackground: '#e8f5e9',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
