import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ImageInput } from './ImageInput';

const meta: Meta<typeof ImageInput> = {
  title: 'Shared/ImageInput',
  component: ImageInput,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ImageInput>;

const DemoSingle: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: 480 }}>
      <ImageInput onFilesChange={setFiles} multiple={false} />
      <div style={{ marginTop: 12, fontSize: 12 }}>Всего файлов: {files.length}</div>
    </div>
  );
};

export const Single: Story = { render: () => <DemoSingle /> };

const DemoMultiple: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div style={{ width: 640 }}>
      <ImageInput onFilesChange={setFiles} multiple />
      <div style={{ marginTop: 12, fontSize: 12 }}>Всего файлов: {files.length}</div>
    </div>
  );
};

export const Multiple: Story = { render: () => <DemoMultiple /> };
