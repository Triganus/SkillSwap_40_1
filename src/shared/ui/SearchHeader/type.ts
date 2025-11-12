export type SearchHeaderProps = {
  title: string;
  total?: number;
  sortOrder?: 'newest' | 'oldest';
  onSortChange?: (order: 'newest' | 'oldest') => void;
};
