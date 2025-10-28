import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import error404Url from '@shared/assets/images/error404.svg';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleReport = useCallback(() => {}, []);

  return (
    <section className={styles.container} aria-labelledby="not-found-title">
      <figure className={styles.illustration} aria-hidden="true">
        <img src={error404Url} alt="" loading="lazy" />
      </figure>

      <div className={styles.pageContent}>
        <h1 id="not-found-title" className={styles.title}>
          Страница не найдена
        </h1>
        <p className={styles.description}>
          К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже.
        </p>
      </div>

      <div className={styles.actions} role="group" aria-label="Действия на странице 404">
        <Button variant="secondary" size="large" onClick={handleReport}>
          Сообщить об ошибке
        </Button>
        <Button variant="primary" size="large" onClick={handleGoHome}>
          На главную
        </Button>
      </div>
    </section>
  );
}
