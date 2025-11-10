import React from 'react';
import { PreloaderUI } from '../Preloader';
import styles from './PagePreloader.module.scss';

export const PagePreloader: React.FC = () => {
  return (
    <div className={styles.pagePreloader}>
      <PreloaderUI size="large" ariaLabel="Загрузка страницы" />
    </div>
  );
};
