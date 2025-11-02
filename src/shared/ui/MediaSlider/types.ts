export type MediaItem = {
  id: string;
  src: string;
  alt?: string;
};

export interface MediaSliderProps<T extends MediaItem = MediaItem> {
  items: T[];
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
  /**
   * Функция для получения уникального идентификатора элемента.
   * Если не передана, используется item.id или индекс элемента.
   */
  getItemId?: (item: T) => string | number;
  /**
   * Включить виртуализацию слайдов для оптимизации производительности.
   * Полезно при работе с большим количеством элементов.
   */
  virtualized?: boolean;
}
