import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import error500Url from '@shared/assets/images/error500.svg';
import styles from './ServerErrorPage.module.scss';

export default function ServerErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleReport = useCallback(() => {}, []);

  return (
    <section className={styles.container} aria-labelledby="server-error-title">
      <figure className={styles.illustration} aria-hidden="true">
        <img src={error500Url} alt="Ошибка сервера 500" loading="lazy" />
      </figure>

      <div className={styles.pageContent}>
        <h1 id="server-error-title" className={styles.title}>
          На сервере произошла ошибка
        </h1>
        <p className={styles.description}>Попробуйте позже или вернитесь на главную страницу</p>
      </div>

      <div className={styles.actions} role="group" aria-label="Действия на странице 500">
        <Button variant="secondary" onClick={handleReport}>
          Сообщить об ошибке
        </Button>
        <Button variant="primary" onClick={handleGoHome}>
          На главную
        </Button>
      </div>
    </section>
  );
}
