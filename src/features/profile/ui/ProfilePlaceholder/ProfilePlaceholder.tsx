import type { ReactNode } from 'react';
import { TitleUI } from '@/shared/ui/Title';
import { TextUI } from '@/shared/ui';
import styles from './ProfilePlaceholder.module.scss';

interface ProfilePlaceholderProps {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export const ProfilePlaceholder = ({ title, description, children }: ProfilePlaceholderProps) => (
  <div className={styles.wrapper}>
    <TitleUI size="large">{title}</TitleUI>
    {description ? (
      <TextUI variant="body" color="secondary" className={styles.description}>
        {description}
      </TextUI>
    ) : null}
    {children ? <div className={styles.actions}>{children}</div> : null}
  </div>
);

export default ProfilePlaceholder;
