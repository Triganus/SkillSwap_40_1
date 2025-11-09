export type ProfileFormValues = {
  avatarFile: File | null;
  avatarUrl: string | null;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  about: string;
};

export type ProfileFormProps = {
  formValue: ProfileFormValues;
  isFormChanged: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    field: keyof Omit<ProfileFormValues, 'avatarFile' | 'avatarUrl'>,
    value: string
  ) => void;
  handleAvatarChange: (file: File | null) => void; // ← новый колбэк
  fieldErrors?: Partial<Record<keyof ProfileFormValues, string>>;
};
