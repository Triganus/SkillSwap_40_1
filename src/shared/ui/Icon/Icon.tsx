import React from 'react';

export type IconProps = {
  /** часть после `icon-` в сгенерированном id символа. Пример: `shared-add` для `icon-shared-add` */
  name: string;
  /** размер в px или любой CSS единице измерения. По умолчанию: 24 */
  size?: number | string;
  /** доступный заголовок; если указан, role="img" и aria-hidden=false */
  title?: string;
  className?: string;
  /** дополнительные SVG-атрибуты */
  svgProps?: React.SVGProps<SVGSVGElement>;
};

/**
 * Компонент Icon, который отрисовывает SVG символ из сгенерированного спрайта.
 *
 * Пример использования:
 *   <Icon name="shared-add" size={20} />
 */
export const Icon: React.FC<IconProps> = ({ name, size, title, className, svgProps = {} }) => {
  const resultSize = size || 24;
  const sizeValue = typeof resultSize === 'number' ? `${resultSize}` : resultSize;
  const ariaHidden = title ? undefined : true;
  const role = title ? 'img' : 'presentation';
  const fill = svgProps.fill ?? 'currentColor';

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={title}
      className={className}
      fill={fill}
      {...svgProps}
    >
      {title ? <title>{title}</title> : null}
      <use href={`#icon-${name}`} />
    </svg>
  );
};

export default Icon;
