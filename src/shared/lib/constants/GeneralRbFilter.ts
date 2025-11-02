export const GENERAL_RB_FILTER_OPTIONS = [
  { label: 'Всё', value: '' },
  { label: 'Хочу научиться', value: 'Хочу научиться' },
  { label: 'Могу научить', value: 'Могу научить' },
] as const;

export type GeneralRbFilterValue = (typeof GENERAL_RB_FILTER_OPTIONS)[number]['value'];
