export type RadioButtonItem = {
  label: string;
  value: string;
};

export type TRadioButtonGroupProps = {
  items: string[] | RadioButtonItem[] | readonly RadioButtonItem[];

  title?: string;

  name?: string;

  defaultValue?: string | null;

  value?: string | null

  onChange?: (value: string) => void;
};
