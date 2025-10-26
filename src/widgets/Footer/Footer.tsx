import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { LogoUI } from '@/shared/ui/Logo';

export const FooterWidget: /*FC<TFooterWidgetProps> = ({ userName })*/ React.FC = () => (
  <footer className={styles.footer}>
    <LogoUI className={styles.footerLogo} />
    <span className={styles.footerCopyright}>SkillSwap — 2025</span>
    <div className={styles.footerContent}>
      {' '}
      {/* Контейнер для колонок */}
      {/* Левая колонка: Список с • */}
      <nav className={styles.footerColumn}>
        <ul className={styles.footerLinksListWithDot}>
          <li>
            <Link to="/project">О проекте</Link>
          </li>
          <li>
            <Link to="/skills">Все навыки</Link>
          </li>
        </ul>
      </nav>
      {/* Средняя колонка: Контакты */}
      <nav className={styles.footerColumn}>
        <ul className={styles.footerLinksList}>
          <li>
            <Link to="/contacts">Контакты</Link>
          </li>
          <li>
            <Link to="/blog">Блог</Link>
          </li>
        </ul>
      </nav>
      {/* Правая колонка: Политика */}
      <nav className={styles.footerColumn}>
        <ul className={styles.footerLinksList}>
          <li>
            <Link to="/privacy">Политика конфиденциальности</Link>
          </li>
          <li>
            <Link to="/terms">Пользовательское соглашение</Link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);
