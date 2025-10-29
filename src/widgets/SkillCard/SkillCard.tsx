import { SkillCard } from '@/shared/ui/SkillCard';
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
