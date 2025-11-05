import type React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  // const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    const urlVal = searchParams.get('search') ?? '';
    setSearchValue((prev) => (prev !== urlVal ? urlVal : prev));
  }, [searchParams]);

  const classes = [cls.header, auth.isAuthenticated && cls.authenticated].filter(Boolean).join(' ');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setSearchValue(next);
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          if (next.trim()) sp.set('search', next);
          else sp.delete('search');
          return sp;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

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
            value={searchValue}
            onChange={handleChange}
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
