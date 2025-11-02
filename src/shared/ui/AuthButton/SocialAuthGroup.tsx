import React, { useMemo } from 'react';
import { AuthButton } from './SocialAuthButton';
import type { AuthProvider } from './types';
import styles from './SocialAuthGroup.module.scss';

export interface SocialAuthGroupProps {
  providers?: AuthProvider[];
  gap?: number | string;
  onClick?: (provider: AuthProvider) => void;
  className?: string;
}

export const SocialAuthGroup: React.FC<SocialAuthGroupProps> = ({
  providers = ['google', 'apple'],
  gap = 32,
  onClick,
  className,
}) => {
  const gridStyle = useMemo<React.CSSProperties>(() => ({ gap }) as React.CSSProperties, [gap]);

  return (
    <div className={`${styles.group} ${className || ''}`} style={gridStyle}>
      {providers.map((p) => (
        <AuthButton key={p} provider={p} onClick={onClick ? () => onClick(p) : undefined} />
      ))}
    </div>
  );
};
