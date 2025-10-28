import { useMemo, createElement } from 'react';
import { Icon } from '@shared/ui/Icon';
import type { ActionItem } from '@shared/ui';
import { toggleTheme } from '@shared/lib/theme';
import { useAuth } from '@app/Provider';
import { useNavigate } from 'react-router-dom';

/**
 * Модель для Header: формирует список действий (иконок) в зависимости от контекста приложения.
 * Виджет Header отвечает только за отображение, а не за принятие решения, какие элементы показывать.
 */
export function useHeaderActions(): ActionItem[] {
  const { auth } = useAuth();
  const navigate = useNavigate();

  return useMemo<ActionItem[]>(() => {
    const common: ActionItem[] = [
      {
        id: 'theme',
        kind: 'button',
        ariaLabel: 'Переключить тему',
        hint: 'Светлая/темная тема',
        icon: createElement(Icon, { name: 'moon', size: 24, title: 'Переключить тему' }),
        onClick: () => {
          toggleTheme();
        },
      },
    ];

    if (!auth.isAuthenticated) return common;

    const authedExtra: ActionItem[] = [
      {
        id: 'notifications',
        kind: 'button',
        ariaLabel: 'Уведомления',
        hint: 'События',
        hasIndicator: false,
        icon: createElement(Icon, {
          name: 'notification',
          size: 24,
          title: 'Уведомления',
          stroke: 'currentColor',
          fill: 'none',
        }),
        onClick: () => {},
      },
      {
        id: 'favorites',
        kind: 'button',
        ariaLabel: 'Избранное',
        hint: 'Перейти в избранное',
        icon: createElement(Icon, { name: 'like', size: 24, title: 'Избранное' }),
        onClick: () => navigate('/favorites'),
      },
    ];

    return [...common, ...authedExtra];
  }, [auth.isAuthenticated, navigate]);
}
