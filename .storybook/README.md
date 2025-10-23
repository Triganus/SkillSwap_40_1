# Storybook Configuration

Этот проект настроен с использованием Storybook для разработки и тестирования UI компонентов.

## Запуск Storybook

```bash
npm run storybook
```

Storybook будет доступен по адресу: http://localhost:6006

## Сборка Storybook

```bash
npm run build-storybook
```

## Структура Stories

Stories размещаются рядом с компонентами согласно FSD архитектуре:

```
src/
  shared/
    ui/
      Button/
        Button.tsx
        Button.stories.tsx
        Button.module.scss
        types.ts
        index.ts
```

## Поддерживаемые функции

- ✅ TypeScript
- ✅ CSS Modules
- ✅ React 19
- ✅ Vite
- ✅ Accessibility testing (a11y)
- ✅ Documentation

## Создание новых Stories

1. Создайте компонент в `src/shared/ui/ComponentName/`
2. Добавьте файл `ComponentName.stories.tsx`
3. Используйте следующий шаблон:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Shared/UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // props here
  },
};
```
