export type SliderProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading?: boolean;
  showArrows?: boolean; // default true
  className?: string;
  slidesPerView?: number | 'auto'; // default 'auto'
  spaceBetween?: number; // default 16
};
