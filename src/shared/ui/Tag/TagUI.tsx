import { TextUI } from '@/shared/ui/Text';
import styles from './TagUI.module.scss';
import type { TTagUIProps } from './TTagUIProps';

export const TagUI: React.FC<TTagUIProps> = ({
  label,
  category = 'other',
  className = '',
  style,
}: TTagUIProps) => {
  const classes = [styles.tag, styles[category], className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style}>
      <TextUI variant="caption" color="primary">
        {label}
      </TextUI>
    </div>
  );
};
