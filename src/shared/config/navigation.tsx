import type { TNavItemNode } from '@/shared/types';

export const baseNavItems: TNavItemNode[] = [
  {
    key: 'about',
    to: '/project',
    label: 'О проекте',
    end: true,
  },
  {
    key: 'skills',
    to: '/skills',
    label: 'Все навыки',
  },
];

export const infoNavItems: TNavItemNode[] = [
  {
    key: 'contacts',
    to: '/contacts',
    label: 'Контакты',
    end: true,
  },
  {
    key: 'blog',
    to: '/blog',
    label: 'Блог',
  },
];

export const docsNavItems: TNavItemNode[] = [
  {
    key: 'privacy',
    to: '/privacy',
    label: 'Политика конфиденциальности',
    end: true,
  },
  {
    key: 'terms',
    to: '/terms',
    label: 'Пользовательское соглашение',
  },
];
