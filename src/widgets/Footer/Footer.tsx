import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'Footer.module.css';

export const FooterWidget: /*FC<TFooterWidgetProps> = ({ userName })*/React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.logo}>
      <img src="path_to_logo" alt="SkillSwap" />
      <p>SkillSwap - 2025</p>
    </div>
    <div className={styles.links}>
      <Link to="/project" className={styles.link}>
        О проекте
      </Link>
      <Link to="/skills" className={styles.link}>
        Все навыки
      </Link>
    </div>
    <div className={styles.contacts}>
      <Link to="/contacts" className={styles.link}>
        Контакты
      </Link>
      <Link to="/blog" className={styles.link}>
        Блог
      </Link>
    </div>
    <div className={styles.policies}>
      <Link to="/privacy" className={styles.link}>
        Политика конфиденциальности
      </Link>
      <Link to="/terms" className={styles.link}>
        Пользовательское соглашение
      </Link>
    </div>
  </footer>
);
