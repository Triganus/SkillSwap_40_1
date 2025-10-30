import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkillsSideBarUI as SkillsSideBar }   from './SkillsSideBarUI';
import type { SkillCategoriesData } from '@/entities/Skill';

type ComponentProps = React.ComponentProps<typeof SkillsSideBar>;
type StoryProps = ComponentProps & {};

const meta: Meta<StoryProps> = {
  title: 'Shared/SkillsSideBar',
  component: SkillsSideBar,
  tags: ['autodocs'],

  loaders: [
    async () => {
      const res = await fetch('/db/skills.json');
      const data: SkillCategoriesData = await res.json();
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


function DemoStory({
  args,
  skillsData,
}: {
  args: StoryProps;
  skillsData: SkillCategoriesData;
}) {
  const [liveJson, setLiveJson] = useState<SkillCategoriesData | null>(null);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SkillsSideBar
        {...args}
        data={skillsData}
        onChange={(payload) => setLiveJson(payload)}
      />

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
        <strong>onChange (live) JSON:</strong>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(liveJson, null, 2)}
        </pre>
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
