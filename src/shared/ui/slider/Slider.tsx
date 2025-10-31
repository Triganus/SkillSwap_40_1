import React, { useMemo, useRef } from 'react';
import styles from './Slider.module.scss';
import type { SliderProps } from './types';
import { Icon } from '@shared/ui';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

export function Slider<T>({
  data,
  renderItem,
  loading = false,
  showArrows = true,
  className = '',
  slidesPerView = 'auto',
  spaceBetween = 16,
}: SliderProps<T>): React.ReactElement {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const containerClassName = useMemo(
    () => [styles.slider, className].filter(Boolean).join(' '),
    [className]
  );

  if (loading) {
    const skeletonCount = typeof slidesPerView === 'number' ? slidesPerView : 3;
    return (
      <div className={containerClassName}>
        <div className={styles.track}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className={containerClassName} />;
  }

  return (
    <div className={containerClassName}>
      {showArrows !== false && (
        <>
          <button ref={prevRef} className={`${styles.nav} ${styles.prev}`} aria-label="Prev">
            <Icon name="chevron-right" size={16} className={styles.chevronLeft} />
          </button>
          <button ref={nextRef} className={`${styles.nav} ${styles.next}`} aria-label="Next">
            <Icon name="chevron-right" size={16} />
          </button>
        </>
      )}

      <Swiper
        modules={showArrows !== false ? [Navigation] : []}
        navigation={
          showArrows !== false ? { prevEl: prevRef.current, nextEl: nextRef.current } : undefined
        }
        onBeforeInit={(swiper) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sw = swiper as any;
          if (showArrows !== false) {
            sw.params.navigation.prevEl = prevRef.current;
            sw.params.navigation.nextEl = nextRef.current;
          }
        }}
        slidesPerView={slidesPerView as never}
        spaceBetween={spaceBetween}
        className={styles.swiper}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
