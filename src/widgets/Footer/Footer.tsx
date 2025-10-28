import React from 'react';
import styles from './Footer.module.scss';
import { LogoUI } from '@/shared/ui/Logo';
import { NavMenu } from '@widgets/NavMenu';
import { baseNavItems, docsNavItems, infoNavItems } from '@/shared/config/navigation';

export const FooterWidget: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={styles.footerBrand}>
        <LogoUI className={styles.footerLogo} />
        <span className={styles.footerCopyright}>SkillSwap — 2025</span>
      </div>
      <NavMenu
        className={styles.footerColumn}
        orientation="column"
        showMarkers
        items={baseNavItems}
      />
      <NavMenu className={styles.footerColumn} orientation="column" items={infoNavItems} />
      <NavMenu className={styles.footerColumn} orientation="column" items={docsNavItems} />
    </div>
  </footer>
);
