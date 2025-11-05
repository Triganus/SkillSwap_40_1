import React from 'react';
import { Icon, TextUI } from '@/shared/ui';
import { NavLink } from 'react-router-dom';
import styles from './ProfileSidebar.module.scss';

interface ISidebarItem {
  to: string;
  icon: string;
  text: string;
  strokeIcon?: boolean;
}

const sidebarItems: ISidebarItem[] = [
  {
    to: '/profile/requests',
    icon: 'request',
    text: 'Заявки',
  },
  {
    to: '/profile/exchanges',
    icon: 'message-text',
    text: 'Мои обмены',
  },
  {
    to: '/profile/favorites',
    icon: 'like',
    text: 'Избранное',
  },
  {
    to: '/profile/skills',
    icon: 'idea',
    text: 'Мои навыки',
    strokeIcon: true,
  },
  {
    to: '/profile',
    icon: 'user',
    text: 'Личные данные',
  },
];

export const ProfileSidebar: React.FC = () => {
  return (
    <nav aria-label="Боковая панель профиля пользователя" className={styles.sidebar}>
      {sidebarItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
          end
        >
          <Icon
            name={item.icon}
            size={24}
            fill={item.strokeIcon ? 'none' : '#253017'}
            stroke={item.strokeIcon ? '#253017' : 'none'}
            aria-hidden="true"
          />
          <TextUI variant="body" color="primary">
            {item.text}
          </TextUI>
        </NavLink>
      ))}
    </nav>
  );
};
