/*import { SkillCard } from '@/shared/ui/SkillCard';
import { user, teachingSkills, learningSkills } from './PlaceholderDelete';

// TODO: добавить типизацию при создании бизнес-логики
export const SkillCardWidget = () => {
  const handleDetailsClick = () => {
    console.log('Подробнее');
  };

  const handleLikeClick = () => {
    console.log('I like');
  };

  return (
    <SkillCard
      user={user} // заглушка
      teachingSkills={teachingSkills} // заглушка
      learningSkills={learningSkills} // заглушка
      onDetailsClick={handleDetailsClick} // заглушка
      onLikeClick={handleLikeClick} // заглушка
      isLiked={false}
    />
  );
};

export { SkillCard };*/
import React from 'react';
import { SkillCard, type SkillCardProps } from '@/shared/ui/SkillCard';

// Виджет, который использует базовый UI-компонент SkillCard
// Может содержать дополнительную бизнес-логику, если потребуется
export const SkillCardWidget: React.FC<SkillCardProps> = (props) => {
  // Дефолтные обработчики для будущего использования
  // (например, если пропсы не переданы или нужно добавить логику)
  const handleDetailsClick = () => {
    console.log('Подробнее');
    // В будущем здесь можно добавить:
    // - Навигацию на страницу навыка
    // - Аналитику (отслеживание кликов)
    // - Логирование действий пользователя
  };

  const handleLikeClick = () => {
    console.log('Лайк');
    // В будущем здесь можно добавить:
    // - Сохранение в избранное (localStorage)
    // - Отправку запроса на сервер
    // - Обновление Redux-стора
  };

  // Используем обработчики из пропсов, если они переданы,
  // иначе используем дефолтные обработчики
  return (
    <SkillCard
      {...props}
      onDetailsClick={props.onDetailsClick ?? handleDetailsClick}
      onLikeClick={props.onLikeClick ?? handleLikeClick}
    />
  );
};

export { SkillCard };
