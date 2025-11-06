export interface SkillsPopupProps {
  isOpen: boolean;

  onClose: () => void;

  buttonRef?: React.RefObject<HTMLElement | null>;
}
