import { TitleUI } from '@shared/ui/Title';
import { Icon } from '@/shared/ui/Icon';
import styles from './SearchHeaderUI.module.scss';
import type { SearchHeaderProps } from './type';
import { memo, type FC } from 'react';

export const SearchHeaderUI: FC<SearchHeaderProps> = memo(
  ({ title, total, sortOrder = 'newest', onSortChange }) => {
    const handleSortClick = () => {
      if (onSortChange) {
        onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');
      }
    };

    return (
      <div className={styles.searchHeader}>
        <TitleUI size="large" className={styles.searchTitle}>
          {total !== undefined ? `${title}: ${total}` : title}
        </TitleUI>
        {onSortChange && (
          <button
            type="button"
            className={styles.sortButton}
            onClick={handleSortClick}
            aria-label={
              sortOrder === 'newest' ? 'Сортировать сначала старые' : 'Сортировать сначала новые'
            }
          >
            <Icon name="sort" size={24} className={styles.sortIcon} />
            {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
          </button>
        )}
      </div>
    );
  }
);
