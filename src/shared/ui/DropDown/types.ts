export interface TDropDownUIProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  id?: string;
  ariaLabel?: string;
  className?: string;
  fullWidth?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}
