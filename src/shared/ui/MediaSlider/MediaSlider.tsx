import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import styles from './MediaSlider.module.scss';
import type { MediaSliderProps } from './types';
import { Icon } from '../Icon/Icon.tsx';

const toCssSize = (val: number | string): string => (typeof val === 'number' ? `${val}px` : val);

export const MediaSlider: React.FC<MediaSliderProps> = ({
  items,
  className,
  onChangeIndex,
  disableWhenSingle = true,
  mainSize = 324,
  thumbScale = 92 / 324,
}) => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'prev' | 'next' | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  const total = items.length;

  const visible = useMemo(() => {
    if (total === 0) return [] as typeof items;

    const res: typeof items = [];

    for (let i = 0; i < Math.min(4, total); i += 1) {
      res.push(items[(index + i) % total]);
    }

    return res;
  }, [items, index, total]);

  const extraCount = total > 4 ? total - 4 : 0;

  const goPrev = useCallback(() => {
    if (total <= 1 && disableWhenSingle) return;

    setDir('prev');
    setIndex((i) => (i - 1 + total) % total);
  }, [total, disableWhenSingle]);

  const goNext = useCallback(() => {
    if (total <= 1 && disableWhenSingle) return;

    setDir('next');
    setIndex((i) => (i + 1) % total);
  }, [total, disableWhenSingle]);

  const onThumbClick = useCallback(
    (thumbIdx: number) => () => {
      if (total === 0) return;

      setDir('next');
      setIndex((i) => (i + thumbIdx) % total);
    },
    [total]
  );

  const handleAfterSetIndex = useCallback(
    (nextIndex: number) => {
      onChangeIndex?.(nextIndex);
    },
    [onChangeIndex]
  );

  React.useEffect(() => {
    handleAfterSetIndex(index);
  }, [index, handleAfterSetIndex]);

  const rootCls = [styles.slider, className].filter(Boolean).join(' ');

  const sizeStyle: React.CSSProperties = useMemo(() => {
    const value = toCssSize(mainSize as number | string);

    return {
      ['--media-main-size' as never]: value,
      ['--media-thumb-scale' as never]: thumbScale,
    };
  }, [mainSize, thumbScale]);

  const hasThumbs = visible.length > 1;
  const showNav = !(total <= 1 && disableWhenSingle);

  const mainImageCls = useMemo(() => {
    const cls = [styles.mainImage];

    if (dir === 'next') cls.push(styles.dirNext);
    if (dir === 'prev') cls.push(styles.dirPrev);

    return cls.join(' ');
  }, [dir]);

  return (
    <div className={rootCls} style={sizeStyle}>
      <div className={styles.main}>
        <Swiper
          onSwiper={(sw) => {
            swiperRef.current = sw;
          }}
          allowTouchMove={false}
          slidesPerView={1}
        >
          {visible.length > 0 ? (
            <SwiperSlide>
              <img
                key={visible[0].id}
                src={visible[0].src}
                alt={visible[0].alt ?? ''}
                className={mainImageCls}
                loading="lazy"
                decoding="async"
                onAnimationEnd={() => setDir(null)}
              />
            </SwiperSlide>
          ) : null}
        </Swiper>

        {showNav && (
          <div className={styles.nav} aria-hidden={!showNav}>
            <button
              type="button"
              className={[styles.navBtn].filter(Boolean).join(' ')}
              onClick={goPrev}
              aria-label="Previous image"
            >
              <Icon
                name="chevron-right"
                size={20}
                className={styles.icon}
                svgProps={{ style: { transform: 'scaleX(-1)' } }}
              />
            </button>
            <button
              type="button"
              className={[styles.navBtn].filter(Boolean).join(' ')}
              onClick={goNext}
              aria-label="Next image"
            >
              <Icon name="chevron-right" size={20} className={styles.icon} />
            </button>
          </div>
        )}
      </div>

      {hasThumbs && (
        <div className={styles.thumbs} aria-hidden={!hasThumbs}>
          {[1, 2, 3].map((offset) => {
            const item = visible[offset];

            if (!item) return null;

            return (
              <button
                type="button"
                key={item.id}
                onClick={onThumbClick(offset)}
                className={styles.thumb}
                aria-label={`Open image ${offset + 1}`}
              >
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  className={styles.thumbImage}
                  loading="lazy"
                  decoding="async"
                />
                {offset === 3 && extraCount > 0 && (
                  <div className={styles.counterOverlay}>+{extraCount}</div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
