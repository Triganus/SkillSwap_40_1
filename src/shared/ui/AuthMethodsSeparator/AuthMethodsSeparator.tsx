import React from 'react';
import styles from './AuthMethodsSeparator.module.scss';

export interface AuthMethodsSeparatorProps {
  children: React.ReactNode;
  separatorText?: string;
  showSeparator?: boolean;
  className?: string;
}

/**
 * Контейнер, который размещает дочерние элементы столбцом и
 * по желанию вставляет текстовый разделитель между секциями.
 */
export const AuthMethodsSeparator: React.FC<AuthMethodsSeparatorProps> = ({
  children,
  separatorText = 'или',
  showSeparator = true,
  className,
}) => {
  const items = React.Children.toArray(children);

  if (!showSeparator || items.length <= 1) {
    return <div className={`${styles.wrapper} ${className || ''}`}>{children}</div>;
  }

  const result: React.ReactNode[] = [];

  items.forEach((child, index) => {
    result.push(child);

    const isLast = index === items.length - 1;

    if (!isLast) {
      result.push(
        <div key={`sep-${index}`} className={styles.separator}>
          {separatorText}
        </div>
      );
    }
  });

  return <div className={`${styles.wrapper} ${className || ''}`}>{result}</div>;
};
