import type { Meta, StoryObj } from '@storybook/react';
import { NotificationItem } from './NotificationItem';
import { Icon } from '../Icon';

const meta: Meta<typeof NotificationItem> = {
  title: 'Shared/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    meta: 'сегодня',
  },
};
export default meta;

type Story = StoryObj<typeof NotificationItem>;

export const New: Story = {
  render: (args) => (
    <NotificationItem
      {...args}
      icon={
        <Icon
          name="idea"
          size={48}
          title="24px"
          svgProps={{ fill: 'none', stroke: 'currentColor' }}
        />
      }
    />
  ),
};

export const Viewed: Story = {
  args: {
    title: 'Олег предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    meta: 'вчера',
    viewed: true,
  },
  render: (args) => (
    <NotificationItem {...args} icon={<Icon name="shared-add" size={24} title="24px" />} />
  ),
};
