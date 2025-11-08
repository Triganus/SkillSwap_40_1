import styles from './TextUI.module.scss';
import type { TTextUIProps } from '@shared/ui';

export const TextUI: React.FC<TTextUIProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  className = '',
  style,
}: TTextUIProps) => {
  const classes = [styles.text, styles[variant], styles[color], className]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={classes} style={style}>
      {children}
    </p>
  );
};
