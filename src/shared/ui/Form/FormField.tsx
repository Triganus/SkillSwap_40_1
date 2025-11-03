import React from 'react';

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
        <label htmlFor={htmlFor} style={{ display: 'block', textAlign: 'left' }}>
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
          style={{ color: 'var(--color-error, #bf3920)', textAlign: 'left', marginTop: 6 }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};
