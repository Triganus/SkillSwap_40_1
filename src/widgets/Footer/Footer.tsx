import React from 'react';
import styles from './Footer.module.scss';
import { LogoUI } from '@/shared/ui/Logo';
import { NavMenu } from '@widgets/NavMenu';
import { baseNavItems, docsNavItems, infoNavItems } from '@/shared/config/navigation';

export const FooterWidget: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <div className={styles.footerTop}>
        <LogoUI className={styles.footerLogo} />
      </div>

      <NavMenu
        className={styles.footerMenuCol2}
        orientation="column"
        showMarkers
        items={baseNavItems}
      />
      <NavMenu className={styles.footerMenuCol3} orientation="column" items={infoNavItems} />
      <NavMenu className={styles.footerMenuCol4} orientation="column" items={docsNavItems} />

      <div className={styles.footerBottom}>
        <span className={styles.footerCopyright}>SkillSwap — 2025</span>
      </div>
    </div>
  </footer>
);
