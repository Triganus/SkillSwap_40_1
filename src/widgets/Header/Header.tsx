import type React from 'react';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LogoUI } from '@shared/ui/Logo';
import { NavMenu } from '@widgets/NavMenu';
import { baseNavItems } from '@/shared/config/navigation';
import { SearchUI } from '@shared/ui/Search';
import { Icon } from '@shared/ui/Icon';
import { Actions } from '@shared/ui';
import { useHeaderActions } from './model/useHeaderActions';
import { HeaderUserBlock } from './ui/HeaderUserBlock';
import { SkillsPopup } from '@widgets/SkillsPopup';
import cls from './Header.module.scss';
import { useAuth } from '@app/Provider.tsx';

export const HeaderWidget: React.FC = () => {
  const { auth } = useAuth();

  const items = useHeaderActions();
  // const [searchValue, setSearchValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const [isSkillsPopupOpen, setIsSkillsPopupOpen] = useState(false);
  const skillsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const urlVal = searchParams.get('search') ?? '';
    setSearchValue((prev) => (prev !== urlVal ? urlVal : prev));
  }, [searchParams]);

  const classes = [cls.header, auth.isAuthenticated && cls.authenticated].filter(Boolean).join(' ');

  // Создаем кнопку "Все навыки" для NavMenu
  const skillsNavItem = useMemo(
    () => ({
      key: 'skills',
      node: (
        <button
          ref={skillsButtonRef}
          type="button"
          className={cls['skills-button']}
          onClick={() => setIsSkillsPopupOpen(!isSkillsPopupOpen)}
          aria-label="Все навыки"
          aria-expanded={isSkillsPopupOpen}
        >
          <span>Все навыки</span>
          <Icon
            name="chevron-down"
            size={16}
            className={[cls['skills-icon'], isSkillsPopupOpen && cls['skills-icon-rotated']]
              .filter(Boolean)
              .join(' ')}
          />
        </button>
      ),
    }),
    [isSkillsPopupOpen]
  );

  // Объединяем baseNavItems с кнопкой "Все навыки"
  const navItems = useMemo(() => [...baseNavItems, skillsNavItem], [skillsNavItem]);

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
            <NavMenu orientation="row" items={navItems} />
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
      <SkillsPopup
        isOpen={isSkillsPopupOpen}
        onClose={() => setIsSkillsPopupOpen(false)}
        buttonRef={skillsButtonRef}
      />
    </header>
  );
};
