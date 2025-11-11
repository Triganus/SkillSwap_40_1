import { useNavigate } from 'react-router-dom';
import { Button, TextUI } from '@/shared/ui';
import { TitleUI } from '@/shared/ui/Title';
import styles from './CreateSkillPage.module.scss';

const CreateSkillPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    // TODO: заменить на реальную форму создания навыка
    navigate('/'); // временно ведём на главную после имитации создания
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <TitleUI size="large">Создание навыка</TitleUI>
        <TextUI variant="body" color="secondary" className={styles.description}>
          Раздел создания навыка пока в разработке. Скоро здесь появится форма, где можно будет
          рассказать о своих умениях и найти партнёров по обмену.
        </TextUI>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
          <Button onClick={handleCreate}>Хочу предложить навык</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSkillPage;

