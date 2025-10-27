import React from 'react';

export type IconProps = {
  /** часть после `icon-` в сгенерированном id символа. Пример: `shared-add` для `icon-shared-add` */
  name: string;
  /** размер в px или любой CSS единице измерения. По умолчанию: 24 */
  size?: number | string;
  /** доступный заголовок; если указан, role="img" и aria-hidden=false */
  title?: string;
  className?: string;
  fill?: string;
  stroke?: string;
};

/**
 * Компонент Icon, который отрисовывает SVG символ из сгенерированного спрайта.
 *
 * Пример использования:
 *   <Icon name="shared-add" size={20} />
 */
export const Icon: React.FC<IconProps> = ({ name, size, title, className, fill, stroke }) => {
  const sizeValue = String(size);
  const ariaHidden = title ? undefined : true;
  const role = title ? 'img' : 'presentation';
  const attrFill = fill || 'currentColor';
  const attrStroke = stroke || '';

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={title}
      className={className}
      fill={attrFill}
      stroke={attrStroke}
    >
      {title ? <title>{title}</title> : null}
      <use href={`#icon-${name}`} />
    </svg>
  );
};

export default Icon;
