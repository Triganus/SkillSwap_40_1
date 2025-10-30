export type TCitiesSideBarProps = {
  title: string;
  cities: string[];
  onChange?: (selected: string[]) => void;
  defaultSelected?: string[];
};
