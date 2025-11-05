import type { TTitleUIProps } from './TitleUIProps';
import styles from './TitleUI.module.scss';
import type { JSX } from 'react';

export const TitleUI: React.FC<TTitleUIProps> = ({
  children,
  size = 'medium',
  id,
  className: customClassName,
}) => {
  const className = `${styles.title} ${styles[size]} ${customClassName || ''}`.trim();

  const getTeg = () => {
    switch (size) {
      case 'large':
        return 'h1';
      case 'medium':
        return 'h2';
      case 'small':
        return 'h3';
      case 'xsmall':
        return 'h4';
      default:
        return 'h2';
    }
  };

  const Tag = getTeg() as keyof JSX.IntrinsicElements;

  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
};
