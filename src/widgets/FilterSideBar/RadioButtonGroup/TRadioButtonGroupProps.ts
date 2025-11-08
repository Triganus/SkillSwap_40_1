export type TRadioButtonGroupProps = {
  items: string[];

  title?: string;

  name?: string;

  defaultValue?: string | null;

  value?: string | null;

  onChange?: (value: string) => void;
};
