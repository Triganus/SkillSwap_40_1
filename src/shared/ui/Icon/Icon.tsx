import React from 'react';

export type IconProps = {
  /** часть после `icon-` в сгенерированном id символа. Пример: `shared-add` для `icon-shared-add` */
  name: string;
  /** размер в px или любой CSS единице измерения. По умолчанию: 24 */
  size?: number | string;
  /** доступный заголовок; если указан, role="img" и aria-hidden=false */
  title?: string;
  className?: string;
};

/**
 * Компонент Icon, который отрисовывает SVG символ из сгенерированного спрайта.
 *
 * Пример использования:
 *   <Icon name="shared-add" size={20} />
 */
export const Icon: React.FC<IconProps> = ({ name, size, title, className }) => {
  const sizeValue = typeof (size ?? 24) === 'number' ? `${size}` : size;
  const ariaHidden = title ? undefined : true;
  const role = title ? 'img' : 'presentation';

  return (
    <svg
      width={sizeValue}
      height={sizeValue}
      role={role}
      aria-hidden={ariaHidden}
      aria-label={title}
      className={className}
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      <use href={`#icon-${name}`} />
    </svg>
  );
};

export default Icon;
