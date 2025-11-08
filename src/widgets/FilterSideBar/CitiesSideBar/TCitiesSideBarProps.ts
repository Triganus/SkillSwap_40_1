export type TCitiesSideBarProps = {
  title: string;
  cities: string[];
  value: string[];
  onChange?: (selected: string[]) => void;
};
