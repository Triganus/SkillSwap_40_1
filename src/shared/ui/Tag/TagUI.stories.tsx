import type { Meta, StoryObj } from '@storybook/react';
import { TagUI } from './TagUI';

const meta: Meta<typeof TagUI> = {
  title: 'Shared/Tag',
  component: TagUI,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    category: {
      control: 'inline-radio',
      options: ['business', 'art', 'languages', 'education', 'home', 'health', 'other'],
    },
  },
  args: {
    label: 'Медитация',
    category: 'health',
  },
};

export default meta;
type Story = StoryObj<typeof TagUI>;

export const Playground: Story = {};

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <TagUI label="Бизнес и карьера" category="business" />
      <TagUI label="Творчество и искусство" category="art" />
      <TagUI label="Иностранные языки" category="languages" />
      <TagUI label="Образование и развитие" category="education" />
      <TagUI label="Дом и уют" category="home" />
      <TagUI label="Здоровье и лайфстайл" category="health" />
      <TagUI label="Прочее" category="other" />
    </div>
  ),
};
