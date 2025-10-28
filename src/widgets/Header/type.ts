export type HeaderUser = {
  id: string;
  name: string;
  avatarSrc?: string;
};

export type GuestActionsProps = {
  onLogin: () => void;
  onRegister: () => void;
  className?: string;
};

export type UserBadgeProps = {
  name: string;
  avatarSrc?: string;
  onClick?: () => void;
  className?: string;
};
