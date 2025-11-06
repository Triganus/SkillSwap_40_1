import React from 'react';
import styles from './ImageInput.module.scss';
import type { ImageInputFile, ImageInputProps } from './types';
import { Button, TextUI, Icon } from '@shared/ui';

export const ImageInput: React.FC<ImageInputProps> = ({
  multiple = false,
  accept = 'image/*',
  ariaLabel = 'Загрузить изображения',
  className = '',
  onFilesChange,
  initialFiles = [],
  initialDataUrls = [],
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [items, setItems] = React.useState<ImageInputFile[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  const dataUrlToFile = React.useCallback(async (dataUrl: string, index: number): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = `image-${index + 1}.${blob.type.split('/')[1] || 'png'}`;

    return new File([blob], fileName, { type: blob.type });
  }, []);

  React.useEffect(() => {
    if (initialized) return;

    const init = async () => {
      if (initialDataUrls.length > 0) {
        const filesFromDataUrls = await Promise.all(
          initialDataUrls.map((url, idx) => dataUrlToFile(url, idx))
        );
        const withUrls = filesFromDataUrls.map((file, idx) => ({
          file,
          url: initialDataUrls[idx],
        }));

        setItems(withUrls);
        onFilesChange(filesFromDataUrls);
      } else if (initialFiles.length > 0) {
        const withUrls = initialFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));

        setItems(withUrls);
      }

      setInitialized(true);
    };

    init();
  }, [initialized, initialFiles, initialDataUrls, dataUrlToFile, onFilesChange]);

  const update = React.useCallback(
    (next: ImageInputFile[]) => {
      setItems(next);
      onFilesChange(next.map((i) => i.file));
    },
    [onFilesChange]
  );

  const revokeUrls = (list: ImageInputFile[]) => {
    list.forEach((i) => {
      if (i.url.startsWith('blob:')) {
        URL.revokeObjectURL(i.url);
      }
    });
  };

  React.useEffect(() => () => revokeUrls(items), [items]);

  const pickFiles = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];

      if (!files.length) {
        return;
      }

      const prepared = files.map((file) => ({ file, url: URL.createObjectURL(file) }));

      update(multiple ? [...items, ...prepared] : [prepared[0]]);

      e.target.value = '';
    },
    [items, multiple, update]
  );

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files || []);
      const images = files.filter((f) => f.type.startsWith('image/'));
      if (!images.length) return;
      const prepared = images.map((file) => ({ file, url: URL.createObjectURL(file) }));
      update(multiple ? [...items, ...prepared] : [prepared[0]]);
    },
    [items, multiple, update]
  );

  const onDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!dragging) setDragging(true);
    },
    [dragging]
  );

  const onDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const removeAt = React.useCallback(
    (index: number) => {
      const next = [...items];
      const [removed] = next.splice(index, 1);

      if (removed && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }

      update(next);
    },
    [items, update]
  );

  const rootClass = [styles.root, className].filter(Boolean).join(' ');
  const dropzoneClass = [styles.dropzone, dragging ? 'dragging' : ''].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      <div
        className={dropzoneClass}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={() => pickFiles()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pickFiles();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <TextUI>Перетащите изображения сюда или нажмите, чтобы выбрать</TextUI>
        <div style={{ marginTop: 8 }}>
          <Button
            variant="secondary"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              pickFiles();
            }}
          >
            Выбрать файл
          </Button>
        </div>
        <input
          ref={inputRef}
          className={styles.hiddenInput}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          aria-hidden
          tabIndex={-1}
        />
      </div>

      {items.length > 0 && (
        <div className={styles.previews}>
          {items.map((it, idx) => (
            <div key={`${it.url}-${idx}`} className={styles.item}>
              <img className={styles.thumb} src={it.url} alt={it.file.name} />
              <button
                type="button"
                className={styles.removeBtn}
                aria-label={`Удалить ${it.file.name}`}
                onClick={() => removeAt(idx)}
              >
                <Icon name="close" size={16} />
              </button>
              <div className={styles.filename}>{it.file.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
