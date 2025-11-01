export type AuthProvider = 'google' | 'apple';

export interface AuthButtonProps {
  provider: AuthProvider;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
