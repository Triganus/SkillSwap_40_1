import type { City } from '@/entities/directory/model/types';

export type TCitiesSideBarProps = {
  title: string;
  cities: City[];
  value: string[];
  onChange?: (selected: string[]) => void;
};
