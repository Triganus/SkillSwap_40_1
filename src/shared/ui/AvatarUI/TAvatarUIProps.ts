export interface TAvatarUIProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  /** Размер аватара (ширина/высота в px). Если не задан, используется стиль по умолчанию */
  size?: number;
}
