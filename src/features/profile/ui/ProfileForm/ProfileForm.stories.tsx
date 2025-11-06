import type { Meta, StoryObj } from '@storybook/react';
import { ProfileForm, type ProfileFormValues } from './ProfileForm';

const meta: Meta<typeof ProfileForm> = {
  title: 'Shared/UI/ProfileForm',
  component: ProfileForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFormValues: ProfileFormValues = {
  avatarFile: null,
  name: 'Анна Петрова',
  email: 'anna@example.com',
  gender: 'Женский',
  city: 'Санкт-Петербург',
  about: 'Люблю барабаны и изучаю английский язык.',
  birthDate: '15.04.1990',
};

export const DefaultElement: Story = {
  args: {
    formValue: mockFormValues,
    isFormChanged: true,
    handleSubmit: (e) => {
      e.preventDefault();
      console.log('Form submitted');
    },
    handleInputChange: (field, value) => {
      console.log(`Field "${field}" changed to:`, value);
    },
  },
};
