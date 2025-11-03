import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoUI } from '@shared/ui/Logo';
import { Icon } from '@shared/ui/Icon';
import { Button } from '@shared/ui/Button';
import cls from './GuestHeader.module.scss';
import type { GuestHeaderProps } from './types';

export const GuestHeader: React.FC<GuestHeaderProps> = ({ children, centerContent }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <header className={cls.header}>
      <div className={cls.topRow}>
        <div className={cls.logo}>
          <LogoUI />
        </div>
        <Button
          type="button"
          variant="tertiary"
          className={cls.closeButton}
          onClick={handleClose}
          aria-label="Закрыть и вернуться назад"
        >
          <span className={cls.closeText}>Закрыть</span>
          <Icon name="cross" size={24} />
        </Button>
      </div>
      {(centerContent || children) && (
        <div className={cls.centerContent}>{centerContent || children}</div>
      )}
    </header>
  );
};
