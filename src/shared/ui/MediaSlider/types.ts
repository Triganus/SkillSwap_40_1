export type MediaItem = {
  id: string;
  src: string;
  alt?: string;
};

export interface MediaSliderProps {
  items: MediaItem[];
  className?: string;
  /**
   * Вызывается при изменении текущего индекса
   */
  onChangeIndex?: (index: number) => void;
  /**
   * Отключить кнопки навигации, когда есть только 1 слайд
   */
  disableWhenSingle?: boolean;
  /**
   * Размер основной области превью (ширина/высота), по умолчанию 324px
   */
  mainSize?: number | string;
  /**
   * Масштаб миниатюры относительно mainSize. По умолчанию ~92/324 ≈ 0.285
   */
  thumbScale?: number;
}
