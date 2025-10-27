import React from 'react';
import cls from './Actions.module.scss';
import type { ActionsProps, IconAction } from './types';

export const Actions: React.FC<ActionsProps> = ({ items, className }) => {
  const cn = [cls.root, className].filter(Boolean).join(' ');

  return (
    <div className={cn}>
      {items.map((item) => {
        if (item.kind === 'custom') {
          return (
            <div
              key={item.id}
              className={item.className}
              aria-label={item.ariaLabel}
              title={item.hint}
            >
              {item.node}
            </div>
          );
        }

        const it = item as IconAction;
        const btnCls = [cls.btn, it.className, it.hasIndicator ? cls.indicator : '']
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={it.id}
            type="button"
            className={btnCls}
            onClick={it.onClick}
            aria-label={it.ariaLabel}
            title={it.hint}
          >
            {it.icon}
          </button>
        );
      })}
    </div>
  );
};
