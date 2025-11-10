import type React from 'react';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuthV2 } from '@app/Provider.tsx';
import type { AppDispatch } from '@/app/store';
import {
  fetchNotifications,
  markNotificationViewed,
} from '@/features/notifications/model/notificationsSlice';
import { selectNewNotifications } from '@/features/notifications/model/selectors';
import { NotificationMenu } from './ui/NotificationMenu';
import { useNotificationsPolling } from '@/features/notifications/lib/useNotificationsPolling';
import { NotificationToastList } from '@/features/notifications/ui/NotificationToastList';
import type { INotification } from '@/entities/notification/model/types/types';

export const HeaderWidget: React.FC = () => {
  const { isAuthenticated } = useAuthV2();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '');
  const [isSkillsPopupOpen, setIsSkillsPopupOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const skillsButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const newNotifications = useSelector(selectNewNotifications);

  const items = useHeaderActions({
    onNotificationsClick: () => setNotificationsOpen((prev) => !prev),
    notificationButtonRef,
    unreadCount: isAuthenticated ? newNotifications.length : 0,
  });

  useNotificationsPolling({ enabled: isAuthenticated });

  useEffect(() => {
    const urlVal = searchParams.get('search') ?? '';

    setSearchValue((prev) => (prev !== urlVal ? urlVal : prev));
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && isNotificationsOpen) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated, isNotificationsOpen]);

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotificationsOpen(false);
    }
  }, [isAuthenticated]);

  const classes = [cls.header, isAuthenticated && cls.authenticated].filter(Boolean).join(' ');

  // Создаем кнопку "Все навыки" для NavMenu
  const skillsNavItem = useMemo(
    () => ({
      key: 'skills',
      node: (
        <button
          ref={skillsButtonRef}
          type="button"
          className={cls.skillsButton}
          onClick={() => setIsSkillsPopupOpen(!isSkillsPopupOpen)}
          aria-label="Все навыки"
          aria-expanded={isSkillsPopupOpen}
        >
          <span>Все навыки</span>
          <Icon
            name={isSkillsPopupOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            className={cls['skills-icon']}
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

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (location.pathname !== '/') {
          if (next.trim()) {
            navigate(`/?search=${encodeURIComponent(next)}`, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          setSearchParams(
            (prev) => {
              const sp = new URLSearchParams(prev);
              if (next.trim()) sp.set('search', next);
              else sp.delete('search');
              return sp;
            },
            { replace: true }
          );
        }
      }, 500);
    },
    [setSearchParams, navigate, location.pathname]
  );

  const handleToastClick = useCallback(
    (notification: INotification) => {
      if (!notification.isViewed) {
        dispatch(markNotificationViewed(notification.id));
      }

      if (notification.link) {
        navigate(notification.link);
      }
    },
    [dispatch, navigate]
  );

  const handleToastDismiss = useCallback(
    (notification: INotification) => {
      if (!notification.isViewed) {
        dispatch(markNotificationViewed(notification.id));
      }
    },
    [dispatch]
  );

  return (
    <>
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
            {isNotificationsOpen && isAuthenticated && (
              <NotificationMenu
                anchorRef={notificationButtonRef}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
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
    {isAuthenticated && (
      <NotificationToastList
        notifications={newNotifications}
        onNotificationClick={handleToastClick}
        onNotificationDismiss={handleToastDismiss}
      />
    )}
  </>
  );
};
