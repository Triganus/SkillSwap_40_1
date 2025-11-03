import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styles from './UserAvatarUpload.module.scss';
import DefaultUserIconUrl from '@shared/assets/images/user-circle.svg?url';
import { Icon } from '@shared/ui';

export type UserAvatarUploadHandle = {
  getFile: () => File | null;
  clear: () => void;
  setFile: (file: File | null) => void;
  getPreviewUrl: () => string | null;
};

export type UserAvatarUploadProps = {
  /** Диаметр круглого контейнера в px */
  diameter?: number;
  /** Поддерживаемые типы файлов */
  accept?: string;
  /** Альтернативный текст для изображения */
  alt?: string;
  /** aria-label для интерактивной области */
  ariaLabel?: string;
  /** Класс для корневого контейнера */
  className?: string;
  /** Текущий src аватара пользователя (например, уже загруженный на сервере) */
  initialSrc?: string;
  /** Колбэк при выборе файла. Передается выбранный файл или null при очистке */
  onChange?: (file: File | null) => void;
  /** Отключить взаимодействие */
  disabled?: boolean;
};

export const UserAvatarUpload = forwardRef<UserAvatarUploadHandle, UserAvatarUploadProps>(
  (
    {
      diameter = 54,
      accept = 'image/*',
      alt = 'Аватар пользователя',
      ariaLabel = 'Выбрать аватар',
      className,
      initialSrc,
      onChange,
      disabled = false,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      setImgError(false);
    }, [previewUrl, initialSrc]);

    useEffect(() => {
      if (!file) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);

          setPreviewUrl(null);
        }

        return;
      }

      const url = URL.createObjectURL(file);

      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }, [file]);

    useImperativeHandle(
      ref,
      (): UserAvatarUploadHandle => ({
        getFile: () => file,
        clear: () => {
          setFile(null);
          setImgError(false);

          if (inputRef.current) {
            inputRef.current.value = '';
          }

          onChange?.(null);
        },
        setFile: (f: File | null) => {
          setFile(f);
          onChange?.(f ?? null);
        },
        getPreviewUrl: () => previewUrl,
      }),
      [file, onChange, previewUrl]
    );

    const rootStyle = useMemo<React.CSSProperties>(() => ({
      width: diameter,
      height: diameter,
    }), [diameter]);

    const pickFile = useCallback(() => {
      if (disabled) {
        return;
      }

      inputRef.current?.click();
    }, [disabled]);

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null;

      if (!f) {
        return;
      }

      setFile(f);
      onChange?.(f);

      e.currentTarget.value = '';
    }, [onChange]);

    const showPreview = !!previewUrl && !imgError;
    const showInitial = !showPreview && !!initialSrc && !imgError;
    const hasImage = showPreview || showInitial;

    const containerClass = [styles.root, disabled ? styles.disabled : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={containerClass} style={rootStyle}>
        <button
          type="button"
          className={styles.button}
          aria-label={ariaLabel}
          onClick={pickFile}
          disabled={disabled}
        >
          {showPreview ? (
            <img className={styles.image} src={previewUrl!} alt={alt} onError={() => setImgError(true)} />
          ) : showInitial ? (
            <img className={styles.image} src={initialSrc!} alt={alt} onError={() => setImgError(true)} />
          ) : (
            <img className={styles.placeholder} src={DefaultUserIconUrl} alt={alt} />
          )}
        </button>

        {!disabled && (
          <button
            type="button"
            className={styles.badgeBtn}
            aria-label={hasImage ? 'Изменить аватар' : 'Выбрать аватар'}
            onClick={pickFile}
          >
            <Icon
              name="add"
              size={16}
              title={hasImage ? 'Изменить' : 'Добавить'}
              className={styles.badgeIcon}
              stroke="currentColor"
            />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          aria-hidden
          tabIndex={-1}
          className={styles.input}
          onChange={onInputChange}
        />
      </div>
    );
  }
);

UserAvatarUpload.displayName = 'UserAvatarUpload';
