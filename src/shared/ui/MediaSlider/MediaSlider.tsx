import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Navigation, Virtual } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';
import styles from './MediaSlider.module.scss';
import type { MediaSliderProps } from './types';
import { Icon } from '../Icon/Icon.tsx';
import { TextUI } from '../Text/TextUI';

const toCssSize = (val: number | string): string => (typeof val === 'number' ? `${val}px` : val);

export const MediaSlider = <T extends { id: string; src: string; alt?: string }>({
  items,
  className,
  onChangeIndex,
  disableWhenSingle = true,
  mainSize = 324,
  thumbScale = 92 / 324,
  getItemId,
  virtualized = false,
}: MediaSliderProps<T>) => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<'prev' | 'next' | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const total = items.length;

  const visible = useMemo(() => {
    if (total === 0) return [] as T[];

    const res: T[] = [];

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

      const newIndex = (index + thumbIdx) % total;
      setDir('next');
      setIndex(newIndex);

      // При виртуализации программно переключаем слайд в Swiper
      if (virtualized && swiperRef.current) {
        swiperRef.current.slideTo(newIndex);
      }
    },
    [total, index, virtualized]
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

  const sizeStyle = useMemo<React.CSSProperties>(() => {
    const value = toCssSize(mainSize);

    return {
      '--media-main-size': value,
      '--media-thumb-scale': String(thumbScale),
    } as React.CSSProperties;
  }, [mainSize, thumbScale]);

  const hasThumbs = visible.length > 1;
  const showNav = !(total <= 1 && disableWhenSingle);

  const mainImageCls = useMemo(() => {
    const cls = [styles.mainImage];

    if (dir === 'next') cls.push(styles.dirNext);
    if (dir === 'prev') cls.push(styles.dirPrev);

    return cls.join(' ');
  }, [dir]);

  const getItemKey = useCallback(
    (item: T, fallbackIndex: number): string | number => {
      if (getItemId) {
        return getItemId(item);
      }
      return item.id || fallbackIndex;
    },
    [getItemId]
  );

  const swiperModules = useMemo(() => {
    const modules = [A11y];
    // Navigation модуль нужен только при виртуализации
    if (virtualized) {
      modules.push(Navigation, Virtual);
    }
    return modules;
  }, [virtualized]);

  const sliderId = useMemo(() => `media-slider-${Math.random().toString(36).substring(2, 9)}`, []);

  const swiperConfig: SwiperOptions = useMemo(
    () => ({
      modules: swiperModules,
      allowTouchMove: false,
      slidesPerView: 1,
      navigation:
        showNav && virtualized
          ? {
              prevEl: `[data-slider-id="${sliderId}"] .${styles.navPrev}`,
              nextEl: `[data-slider-id="${sliderId}"] .${styles.navNext}`,
            }
          : false,
      a11y: {
        enabled: true,
        prevSlideMessage: 'Предыдущее изображение',
        nextSlideMessage: 'Следующее изображение',
        firstSlideMessage: 'Это первое изображение',
        lastSlideMessage: 'Это последнее изображение',
        paginationBulletMessage: 'Перейти к изображению {{index}}',
      },
      virtual:
        virtualized && total > 0
          ? {
              slides: items.map((item, idx) => ({
                id: String(getItemKey(item, idx)),
                src: item.src,
                alt: item.alt ?? '',
              })),
            }
          : undefined,
      onSlideChange: (swiper: SwiperType) => {
        if (virtualized) {
          const realIndex = swiper.realIndex;
          setIndex(realIndex);
          handleAfterSetIndex(realIndex);
        }
      },
    }),
    [showNav, swiperModules, virtualized, total, items, getItemKey, sliderId, handleAfterSetIndex]
  );

  if (total === 0) {
    return (
      <div className={rootCls} style={sizeStyle}>
        <div className={styles.main}>
          <div className={styles.empty}>
            <TextUI variant="body" color="muted">
              Здесь пока пусто
            </TextUI>
          </div>
        </div>
      </div>
    );
  }

  const slidesToRender = visible.length > 0 ? [visible[0]] : [];

  return (
    <div className={rootCls} style={sizeStyle} data-slider-id={sliderId}>
      <div className={styles.main}>
        <Swiper
          {...swiperConfig}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {virtualized
            ? // При виртуализации рендерим все слайды с virtualIndex
              items.map((item, idx) => {
                const itemKey = getItemKey(item, idx);
                return (
                  <SwiperSlide key={itemKey} virtualIndex={idx}>
                    <img
                      src={item.src}
                      alt={item.alt ?? ''}
                      className={mainImageCls}
                      loading="lazy"
                      decoding="async"
                      onAnimationEnd={() => setDir(null)}
                    />
                  </SwiperSlide>
                );
              })
            : // Без виртуализации рендерим видимые слайды
              slidesToRender.map((item, slideIndex) => {
                const itemKey = getItemKey(item, slideIndex);
                return (
                  <SwiperSlide key={itemKey}>
                    <img
                      src={item.src}
                      alt={item.alt ?? ''}
                      className={mainImageCls}
                      loading="lazy"
                      decoding="async"
                      onAnimationEnd={() => setDir(null)}
                    />
                  </SwiperSlide>
                );
              })}
        </Swiper>

        {showNav && (
          <div className={styles.nav} role="navigation" aria-label="Навигация по изображениям">
            <button
              type="button"
              className={[styles.navBtn, styles.navPrev].filter(Boolean).join(' ')}
              onClick={virtualized ? undefined : goPrev}
              aria-label="Предыдущее изображение"
            >
              <Icon
                name="chevron-right"
                size={20}
                className={styles.icon}
                svgProps={
                  {
                    style: { transform: 'scaleX(-1)' },
                    'aria-hidden': true,
                  } as React.SVGProps<SVGSVGElement>
                }
              />
            </button>
            <button
              type="button"
              className={[styles.navBtn, styles.navNext].filter(Boolean).join(' ')}
              onClick={virtualized ? undefined : goNext}
              aria-label="Следующее изображение"
            >
              <Icon
                name="chevron-right"
                size={20}
                className={styles.icon}
                svgProps={{ 'aria-hidden': true } as React.SVGProps<SVGSVGElement>}
              />
            </button>
          </div>
        )}
      </div>

      {hasThumbs && (
        <div className={styles.thumbs} role="group" aria-label="Миниатюры изображений">
          {[1, 2, 3].map((offset) => {
            const item = visible[offset];

            if (!item) return null;

            const thumbKey = getItemKey(item, offset);

            return (
              <button
                type="button"
                key={thumbKey}
                onClick={onThumbClick(offset)}
                className={styles.thumb}
                aria-label={`Открыть изображение ${offset + 1} из ${total}`}
              >
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  className={styles.thumbImage}
                  loading="lazy"
                  decoding="async"
                />
                {offset === 3 && extraCount > 0 && (
                  <div className={styles.counterOverlay} aria-hidden="true">
                    +{extraCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
