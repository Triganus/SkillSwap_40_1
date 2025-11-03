import type { FilterPayload } from '@widgets/FilterSideBar/TFilterSideBarProps';

export interface TAppliedFiltersProps {
  filters: FilterPayload;
  onRemoveFilter: (filterType: FilterType, filterValue: string) => void;
}

export type FilterType = 'general' | 'skill' | 'city' | 'gender';
