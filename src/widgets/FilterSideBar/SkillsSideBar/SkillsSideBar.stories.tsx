import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkillsSideBar } from './SkillsSideBar';
import type { SkillCategoriesData } from '@/entities/Skill';

type ComponentProps = React.ComponentProps<typeof SkillsSideBar>;
type StoryProps = ComponentProps & {};

const meta: Meta<StoryProps> = {
  title: 'Shared/SkillsSideBar',
  component: SkillsSideBar,
  tags: ['autodocs'],

  loaders: [
    async () => {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        fetch('/api/directories/categories'),
        fetch('/api/directories/subcategories'),
      ]);

      const categoriesData = await categoriesRes.json();
      const subcategoriesData = await subcategoriesRes.json();

      const categories = categoriesData.categories;
      const subcategories = subcategoriesData.subcategories;

      // Преобразуем в старый формат для совместимости
      const data: SkillCategoriesData = {
        skill_categories: categories.map((category: { id: string; name: string }) => {
          const categorySubcategories = subcategories.filter(
            (sub: { categoryId: string }) => sub.categoryId === category.id
          );

          return {
            category: category.name,
            skills: categorySubcategories.map((sub: { id: string; name: string }) => ({
              skill_id: sub.id,
              skill_name: sub.name,
              skill_image: '',
            })),
          };
        }),
      };

      return { skillsData: data };
    },
  ],

  args: {
    title: 'Навыки',
  },

  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<StoryProps>;

function DemoStory({ args, skillsData }: { args: StoryProps; skillsData: SkillCategoriesData }) {
  const [liveJson, setLiveJson] = useState<SkillCategoriesData | null>(null);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SkillsSideBar {...args} data={skillsData} onChange={(payload) => setLiveJson(payload)} />

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
        <strong>onChange (live) JSON:</strong>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(liveJson, null, 2)}</pre>
      </div>
    </div>
  );
}

// Истории
export const Default: Story = {
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    return <DemoStory args={args} skillsData={skillsData} />;
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: 'Навыки',
  },
  render: (args, { loaded }) => {
    const { skillsData } = loaded as { skillsData: SkillCategoriesData };
    return <DemoStory args={args} skillsData={skillsData} />;
  },
};
