export interface TLikeButtonUIProps {
  isActive?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  likesCount?: number; // Счетчик лайков
  showCount?: boolean; // Показывать ли счетчик
}
