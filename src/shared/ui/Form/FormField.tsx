import React from 'react';
import styles from './FormField.module.scss';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string | null;
  children: React.ReactNode;
  forceError?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  forceError,
  children,
}) => {
  const describedById = error ? `${htmlFor ?? 'field'}-error` : undefined;
  const isInvalid = Boolean(error || forceError);

  return (
    <div>
      {label ? (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
        </label>
      ) : null}
      {React.isValidElement(children)
        ? (() => {
            const ariaProps: React.AriaAttributes = {
              'aria-invalid': (isInvalid || undefined) as React.AriaAttributes['aria-invalid'],
              'aria-describedby': describedById,
            };

            return React.cloneElement<React.AriaAttributes>(
              children as unknown as React.ReactElement<React.AriaAttributes>,
              ariaProps
            );
          })()
        : children}
      {error ? (
        <div
          id={describedById}
          role="alert"
          className={styles.error}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};
