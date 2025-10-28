import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AccordionUI } from './AccordionUI';
import type { SkillCategoriesData } from '@/entities/skill/model/types/types';

// 1) Собираем тип пропсов для историй: пропсы компонента + служебные поля сторибука
type ComponentProps = React.ComponentProps<typeof AccordionUI>;
type StoryProps = ComponentProps & {
  /** Индекс категории из загруженного skills.json */
  categoryIndex: number;
};

// 2) Вспомогалка: взять категорию по индексу безопасно
function pickCategory(skillsData: SkillCategoriesData, index = 0) {
  const len = skillsData.skill_categories.length;
  const idx = Math.min(Math.max(0, index), Math.max(0, len - 1));
  return skillsData.skill_categories[idx];
}

// 3) Meta типизируем StoryProps, чтобы можно было добавлять categoryIndex
const meta: Meta<StoryProps> = {
  title: 'Shared/Accordion',
  component: AccordionUI,
  tags: ['autodocs'],

  // грузим данные один раз для всех историй
  loaders: [
    async () => {
      const res = await fetch('/db/skills.json');
      const data: SkillCategoriesData = await res.json();
      return { skillsData: data };
    },
  ],

  // дефолтные аргументы
  args: {
    defaultOpen: true,
    checkboxProps: {
      name: 'cat',
      value: 'category',
      defaultChecked: false,
    },
    categoryIndex: 0, // ← это не проп компонента, а служебный аргумент сторибука
  },

  // объявляем контрол для НЕ-пропа компонента
  argTypes: {
    categoryIndex: {
      control: { type: 'number' },
      description: 'Индекс категории из skills.json',
    },
  },

  parameters: { layout: 'padded' },
};

export default meta;

// 4) Истории типизируем тем же StoryProps
type Story = StoryObj<StoryProps>;

export const Default: Story = {
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    const category = pickCategory(skillsData, args.categoryIndex);
    return <AccordionUI {...args} data={category} />;
  },
};

export const Closed: Story = {
  args: { defaultOpen: false },
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    const category = pickCategory(skillsData, args.categoryIndex);
    return <AccordionUI {...args} data={category} />;
  },
};

export const Controlled: Story = {
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    const category = pickCategory(skillsData, args.categoryIndex);

    const ControlledAccordion: React.FC = () => {
      const [open, setOpen] = useState(true);
      return <AccordionUI {...args} data={category} isOpen={open} onToggle={setOpen} />;
    };

    return <ControlledAccordion />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    const category = pickCategory(skillsData, args.categoryIndex);
    return <AccordionUI {...args} data={category} />;
  },
  
};
export const WithDebugOutput: StoryObj<StoryProps> = {
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    const category = pickCategory(skillsData, args.categoryIndex ?? 0);

    type DebugState = { category: string; selected: (string | number)[] } | null;

    const Demo: React.FC = () => {
      const [selectedState, setSelectedState] = React.useState<DebugState>(null);

      return (
        <div style={{ padding: 16 }}>
          <AccordionUI
            {...args}
            data={category}
            onSelectChange={(categoryName, selectedIds) =>
              setSelectedState({ category: categoryName, selected: selectedIds })
            }
          />

          <hr style={{ margin: '16px 0' }} />

          <div>
            <strong>onSelectChange output:</strong>
            <pre>{JSON.stringify(selectedState, null, 2)}</pre>
          </div>
        </div>
      );
    };

    return <Demo />;
  },
};