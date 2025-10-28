import React from 'react';
import styles from './Footer.module.scss';
import { LogoUI } from '@/shared/ui/Logo';
import { NavMenu } from '@widgets/NavMenu';
import { baseNavItems, docsNavItems, infoNavItems } from '@/shared/config/navigation';

export const FooterWidget: /*FC<TFooterWidgetProps> = ({ userName })*/ React.FC = () => (
  <footer className={styles.footer}>
    <LogoUI className={styles.footerLogo} />
    <span className={styles.footerCopyright}>SkillSwap — 2025</span>
    <div className={styles.footerContent}>
      {' '}
      {/* Контейнер для колонок */}
      {/* Левая колонка: Список с • */}
      <NavMenu
        className={styles.footerColumn}
        orientation="column"
        showMarkers
        items={baseNavItems}
      />
      {/* Средняя колонка: Контакты */}
      <NavMenu className={styles.footerColumn} orientation="column" items={infoNavItems} />
      {/* Правая колонка: Политика */}
      <NavMenu className={styles.footerColumn} orientation="column" items={docsNavItems} />
    </div>
  </footer>
);
