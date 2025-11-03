import React from 'react';
import { SkillCard } from '@/shared/ui/SkillCard';
import type { SkillCardProps } from '@/shared/ui/SkillCard';

export const SkillCardWidget: React.FC<SkillCardProps> = (props) => <SkillCard {...props} />;

export { SkillCard } from '@/shared/ui/SkillCard';
