import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import {
  UserAvatarUpload,
  type UserAvatarUploadHandle,
  type UserAvatarUploadProps,
} from '@shared/ui';
import { Button, TextUI } from '@shared/ui';

const meta: Meta<typeof UserAvatarUpload> = {
  title: 'Shared/UI/UserAvatarUpload',
  component: UserAvatarUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    diameter: { control: { type: 'number', min: 40, max: 240, step: 5 } },
    accept: { control: 'text' },
    alt: { control: 'text' },
    ariaLabel: { control: 'text' },
    initialSrc: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    diameter: 54,
  },
};

export const WithInitialSrc: Story = {
  args: {
    diameter: 54,
    initialSrc: 'https://i.pravatar.cc/300?img=12',
  },
};

const WithRefApiDemo = (args: UserAvatarUploadProps) => {
  const ref = useRef<UserAvatarUploadHandle>(null);
  const [fileName, setFileName] = useState<string>('—');

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <UserAvatarUpload
        {...args}
        ref={ref}
        onChange={(file) => setFileName(file?.name ?? '—')}
        diameter={54}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TextUI>Файл: {fileName}</TextUI>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => alert(ref.current?.getFile() ? 'Есть файл' : 'Нет файла')}>
            Проверить файл
          </Button>
          <Button variant="secondary" onClick={() => ref.current?.clear()}>
            Очистить
          </Button>
        </div>
      </div>
    </div>
  );
};

export const WithRefApi: Story = {
  render: (args) => <WithRefApiDemo {...args} />,
};
