import type { TagCategory } from '@/shared/ui/Tag';

export interface Skill {
  id: string;
  title: string;
  description: string;
  type: 'teaching' | 'learning';
  category: TagCategory;
  // tags: string[];
  authorId: string;
  createdAt: string;
}
