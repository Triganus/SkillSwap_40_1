import React, { useEffect, useRef } from 'react';
import type { TInfiniteGridUIProps } from './TInfiniteGridUIProps';
import styles from './InfiniteGridUI.module.scss';

export const InfiniteGridUI: React.FC<TInfiniteGridUIProps> = ({
  children,
  onLoadMore,
  hasMore = true,
  loading = false,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '24px',
  className,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore || loading) return;

    const currentLoader = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [onLoadMore, hasMore, loading]);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div
        className={styles.grid}
        style={
          {
            gap,
            '--grid-columns-mobile': columns.mobile,
            '--grid-columns-tablet': columns.tablet,
            '--grid-columns-desktop': columns.desktop,
          } as React.CSSProperties
        }
      >
        {children}
      </div>

      {hasMore && (
        <div ref={loaderRef} className={styles.loader}>
          {loading && (
            <div className={styles.spinner}>
              <div className={styles.spinnerCircle}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
