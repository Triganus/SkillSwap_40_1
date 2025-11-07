import { type CSSProperties, memo, useCallback, useMemo } from 'react';
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
    leftColumnPadding,
    rightColumnPadding,
    columnBackground = '#ffffff',
    leftColumnBackground,
    rightColumnBackground,
    containerBackground = 'transparent',
    containerPadding = 0,
    columnsTemplate = '1fr 1fr',
    minHeight,
    columnJustify = 'flex-start',
    columnAlign = 'stretch',
    borderRadius,
    leftColumnClassName,
    rightColumnClassName,
  }) => {
    const normalizeSpace = useCallback(
      (value?: number | string) => {
        if (value === undefined) {
          return undefined;
        }

        return typeof value === 'number' ? `${value}px` : value;
      },
      []
    );

    const sharedPadding = normalizeSpace(columnPadding);
    const leftPaddingValue = normalizeSpace(leftColumnPadding) ?? sharedPadding;
    const rightPaddingValue = normalizeSpace(rightColumnPadding) ?? sharedPadding;
    const borderRadiusValue = normalizeSpace(borderRadius);

    const cssVariables = useMemo<CSSProperties>(
      () =>
        ({
          '--gap': typeof gap === 'number' ? `${gap}px` : gap,
          '--columns-template': columnsTemplate,
          '--column-padding': sharedPadding,
          '--left-column-padding': leftPaddingValue,
          '--right-column-padding': rightPaddingValue,
          '--column-bg': columnBackground,
          '--left-column-bg': leftColumnBackground ?? columnBackground,
          '--right-column-bg': rightColumnBackground ?? columnBackground,
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
          '--column-radius': borderRadiusValue,
        }) as CSSProperties,
      [
        gap,
        columnsTemplate,
        sharedPadding,
        leftPaddingValue,
        rightPaddingValue,
        columnBackground,
        leftColumnBackground,
        rightColumnBackground,
        containerBackground,
        containerPadding,
        minHeight,
        columnJustify,
        columnAlign,
        borderRadiusValue,
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
