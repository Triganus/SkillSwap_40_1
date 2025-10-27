export type TagCategory =
  | 'business'
  | 'art'
  | 'languages'
  | 'education'
  | 'home'
  | 'health'
  | 'other';

export type TTagUIProps = {
  label: string;
  category?: TagCategory;
  className?: string;
  style?: React.CSSProperties;
};
