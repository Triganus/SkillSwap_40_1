import type { FilterPayload } from '@/entities/filterSideBar/model';

export interface TAppliedFiltersProps {
  filters: FilterPayload;
  onRemoveFilter: (filterType: FilterType, filterValue: string) => void;
}

export type FilterType = 'general' | 'skill' | 'city' | 'gender';
