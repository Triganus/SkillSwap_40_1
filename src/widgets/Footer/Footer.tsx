import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { LogoUI } from '@/shared/ui/Logo';

export const FooterWidget: React.FC = () => {
  return (
    <footer className={styles.footer}>
      {/* Логотип + копирайт */}
      <div className={styles.logo}>
        <LogoUI className={styles.footerLogo} />
        <span className={styles.copyright}>SkillSwap — 2025</span>
      </div>

      {/* Колонка 1: О проекте + Все навыки */}
      <div className={styles.block}>
        <Link to="/project" className={styles.linkWithDot}>
          О проекте
        </Link>
        <Link to="/skills" className={styles.linkWithDot}>
          Все навыки
        </Link>
      </div>

      {/* Колонка 2: Контакты + Блог */}
      <div className={styles.block}>
        <Link to="/contacts" className={styles.link}>
          Контакты
        </Link>
        <Link to="/blog" className={styles.link}>
          Блог
        </Link>
      </div>

      {/* Колонка 3: Политика + Соглашение */}
      <div className={styles.block}>
        <Link to="/privacy" className={styles.link}>
          Политика конфиденциальности
        </Link>
        <Link to="/terms" className={styles.link}>
          Пользовательское соглашение
        </Link>
      </div>
    </footer>
  );
};