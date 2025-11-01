export type TRadioButtonGroupProps = {
  items: string[];

  title?: string;

  name?: string;

  defaultValue?: string | null;

  onChange?: (value: string) => void;

  resetToken?: number;
};
