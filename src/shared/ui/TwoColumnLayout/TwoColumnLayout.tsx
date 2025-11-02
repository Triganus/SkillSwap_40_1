import { type CSSProperties, memo, useMemo } from 'react';
import type { TwoColumnLayoutProps } from './types';
import styles from './TwoColumnLayout.module.scss';

/**
 * Универсальный компонент для создания макета из двух равноширинных блоков.

 * @example
 * ```tsx
 * <TwoColumnLayout
 *   leftContent={<LoginForm />}
 *   rightContent={<WelcomeBanner />}
 *   gap={24}
 *   columnPadding={32}
 *   borderRadius={8}
 * />
 * ```
 */
export const TwoColumnLayout = memo<TwoColumnLayoutProps>(
  ({
    leftContent,
    rightContent,
    className,
    gap = 0,
    columnPadding = '24px',
    columnBackground = '#ffffff',
    containerBackground = 'transparent',
    containerPadding = 0,
    minHeight,
    columnJustify = 'flex-start',
    columnAlign = 'stretch',
    leftColumnClassName,
    rightColumnClassName,
  }) => {
    const cssVariables = useMemo<CSSProperties>(
      () =>
        ({
          '--gap': typeof gap === 'number' ? `${gap}px` : gap,
          '--column-padding':
            typeof columnPadding === 'number' ? `${columnPadding}px` : columnPadding,
          '--column-bg': columnBackground,
          '--container-bg': containerBackground,
          '--container-padding':
            typeof containerPadding === 'number' ? `${containerPadding}px` : containerPadding,
          '--min-height': minHeight
            ? typeof minHeight === 'number'
              ? `${minHeight}px`
              : minHeight
            : 'auto',
          '--column-justify': columnJustify,
          '--column-align': columnAlign,
        }) as CSSProperties,
      [
        gap,
        columnPadding,
        columnBackground,
        containerBackground,
        containerPadding,
        minHeight,
        columnJustify,
        columnAlign,
      ]
    );

    return (
      <div className={`${styles.container} ${className || ''}`} style={cssVariables}>
        <div className={`${styles.columnLeft} ${leftColumnClassName || ''}`}>{leftContent}</div>
        <div className={`${styles.columnRight} ${rightColumnClassName || ''}`}>{rightContent}</div>
      </div>
    );
  }
);

TwoColumnLayout.displayName = 'TwoColumnLayout';
