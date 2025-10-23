export interface Skill {
  id: string;
  title: string;
  description: string;
  type: 'teaching' | 'learning';
  category: string;
  tags: string[];
  authorId: string;
  createdAt: string;
}
