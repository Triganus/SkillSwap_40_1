import type React from 'react';
import { LogoUI } from '@shared/ui/Logo';
import { NavMenu } from '@widgets/NavMenu';
import { baseNavItems } from '@/shared/config/navigation';
import { SearchUI } from '@shared/ui/Search';
import { Icon } from '@shared/ui/Icon';
import { Actions } from '@shared/ui';
import { useHeaderActions } from './model/useHeaderActions';
import { HeaderUserBlock } from './ui/HeaderUserBlock';
import cls from './Header.module.scss';
import { useAuth } from '@app/Provider.tsx';

export const HeaderWidget: React.FC = () => {
  const { auth } = useAuth();
  const items = useHeaderActions();
  const classes = [cls.header, auth.isAuthenticated && cls.authenticated].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <nav className={cls.nav} aria-label="Верхняя панель навигации">
        <div className={cls.left}>
          <div className={cls.logo}>
            <LogoUI />
          </div>
          <div className={cls.menu}>
            <NavMenu orientation="row" items={baseNavItems} />
          </div>
        </div>
        <div className={cls.center}>
          <SearchUI
            placeholder="Искать навык"
            prefix={<Icon name="search" size={24} title="Поиск" />}
            containerProps={{ style: { width: '100%' } }}
          />
        </div>
        <div className={cls.right}>
          <div className={cls.actions}>
            <Actions items={items} />
          </div>
          <div className={cls.user}>
            <HeaderUserBlock />
          </div>
        </div>
      </nav>
    </header>
  );
};
