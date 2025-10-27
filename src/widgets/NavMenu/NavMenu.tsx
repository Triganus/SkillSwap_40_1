import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { TNavItemNode } from '@/shared/types';
import cls from './NavMenu.module.scss';

export type NavMenuOrientation = 'row' | 'column';

export interface NavMenuProps extends ComponentPropsWithoutRef<'nav'> {
  orientation?: NavMenuOrientation;
  className?: string;
  items: TNavItemNode[];
  showMarkers?: boolean;
}

/**
 * NavMenu — универсальная навигация. Принимает массив элементов (ReactNode),
 * чтобы можно было передавать и ссылки, и произвольные компоненты.
 */
export const NavMenu: React.FC<NavMenuProps> = ({
  orientation = 'row',
  className,
  items,
  showMarkers = false,
  ...navProps
}) => {
  const listClass = [
    cls.list,
    orientation === 'row' ? cls.row : cls.column,
    showMarkers ? cls.withMarkers : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      aria-label="Основная навигация"
      className={[cls.nav, className].filter(Boolean).join(' ')}
      {...navProps}
    >
      <ul className={listClass}>
        {items.map((item) => (
          <li key={item.key} className={cls.item}>
            {'to' in item ? (
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [cls.link, isActive ? cls.active : ''].filter(Boolean).join(' ')
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <span className={cls.link}>{item.node}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
