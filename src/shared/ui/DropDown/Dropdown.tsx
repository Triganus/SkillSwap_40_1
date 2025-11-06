import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Icon } from '@shared/ui/Icon';
import { CheckBoxUI } from '@shared/ui';
import type { TCheckBoxUIProps } from '@shared/ui';
import { useClickOutside, useDebounce, useKeyboardNavigation } from '@shared/hooks';
import styles from './Dropdown.module.scss';
import { DropdownProvider } from './DropdownContext';
import { useDropdownContext } from './useDropdownContext';
import type { DropdownProps, DropdownValue, Option } from './Dropdown.types';

const normalize = (val?: DropdownValue, multiple?: boolean): string[] => {
  if (multiple) return Array.isArray(val) ? val : val ? [val] : [];

  return typeof val === 'string' ? (val ? [val] : []) : Array.isArray(val) ? val.slice(0, 1) : [];
};

const useControllable = <T,>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void
) => {
  const [state, setState] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : state;
  const set = useCallback(
    (v: T) => {
      if (!isControlled) setState(v);
      onChange?.(v);
    },
    [isControlled, onChange]
  );

  return [value, set] as const;
};

export const Dropdown: React.FC<DropdownProps> & {
  Trigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  Menu: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Item: React.FC<{ option: Option; index?: number }>;
  Checkbox: React.FC<{ checked: boolean; 'aria-hidden'?: boolean }>;
} = ({
  id,
  label,
  ariaLabel,
  placeholder = 'Выберите значение',
  size = 'medium',
  disabled = false,
  required = false,
  fullWidth = false,
  className,
  options = [],
  multiple = false,
  value: valueProp,
  defaultValue,
  onChange,
  open,
  defaultOpen,
  onOpenChange,
  hint,
  error,
  errorMessage,
  renderDisplay,
  virtualizeThreshold = 100,
  itemSize = 36,
  menuMaxHeight = 260,
  enableSearch = false,
  searchDebounceMs = 300,
  fit = 'content',
  children,
}) => {
  const reactId = useId();
  const rootId = id ?? `dropdown-${reactId}`;
  const triggerId = `${rootId}-trigger`;
  const menuId = `${rootId}-menu`;

  const [isOpen, setOpen] = useControllable<boolean>(open, !!defaultOpen, onOpenChange);
  const [internal, setInternal] = useControllable<string[]>(
    normalize(valueProp, multiple),
    normalize(defaultValue, multiple),
    (v) => onChange?.(multiple ? v : (v[0] ?? ''))
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside([rootRef, menuRef], () => setOpen(false), isOpen);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, searchDebounceMs);

  const filtered = useMemo(() => {
    if (!enableSearch) return options; // если поиск выключен, показываем все
    if (!debouncedQuery) return options;

    const q = debouncedQuery.toLowerCase();

    return options.filter((o) => String(o.label).toLowerCase().includes(q));
  }, [debouncedQuery, enableSearch, options]);

  const selectedOptions = useMemo(
    () => options.filter((o) => internal.includes(o.value)),
    [internal, options]
  );

  const onItemSelect = useCallback(
    (val: string) => {
      if (multiple) {
        const next = internal.includes(val)
          ? internal.filter((v) => v !== val)
          : [...internal, val];
        setInternal(next);
        setQuery('');
      } else {
        setInternal([val]);
        setQuery('');
        setOpen(false);
      }
    },
    [internal, multiple, setInternal, setOpen]
  );

  // Клавиатурная навигация по видимым (фильтрованным) элементам
  const { activeIndex, setActiveIndex, onKeyDown, getItemId } = useKeyboardNavigation({
    itemCount: filtered.length,
    defaultActiveIndex: -1,
  });

  useEffect(() => {
    if (!isOpen) setActiveIndex(-1);
  }, [isOpen, setActiveIndex]);

  // Фокусируем меню при открытии
  useEffect(() => {
    if (isOpen) {
      // небольшая задержка для монтирования DOM
      const id = setTimeout(() => {
        menuRef.current?.focus();
      }, 0);

      return () => clearTimeout(id);
    }

    return;
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();

      setOpen(!isOpen);

      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      if (!isOpen) {
        setOpen(true);
      }
      // передаём в общий onKeyDown, чтобы выбрать активный элемент
      onKeyDown(e);

      return;
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();

      const opt = filtered[activeIndex];

      if (opt && !opt.disabled) {
        onItemSelect(opt.value);
      }

      return;
    }
    onKeyDown(e);
  };

  const ctxValue = useMemo(
    () => ({
      id: rootId,
      triggerId,
      menuId,
      size,
      disabled,
      required,
      multiple,
      isOpen,
      setOpen,
      placeholder,
      value: internal,
      setValue: setInternal,
      onItemSelect,
      options,
      highlightedIndex: activeIndex,
      setHighlightedIndex: setActiveIndex,
      getItemId,
    }),
    [
      rootId,
      triggerId,
      menuId,
      size,
      disabled,
      required,
      multiple,
      isOpen,
      setOpen,
      placeholder,
      internal,
      setInternal,
      onItemSelect,
      options,
      activeIndex,
      setActiveIndex,
      getItemId,
    ]
  );

  const displayContent = useMemo(() => {
    if (renderDisplay) {
      return renderDisplay(selectedOptions, placeholder);
    }
    if (multiple) {
      return selectedOptions.length ? `Выбрано: ${selectedOptions.length}` : placeholder;
    }

    return selectedOptions[0]?.label ?? placeholder;
  }, [multiple, placeholder, renderDisplay, selectedOptions]);
  const placeholderText = useMemo(
    () => (typeof displayContent === 'string' ? displayContent : String(displayContent)),
    [displayContent]
  );

  // Ленивая загрузка виртуализатора только при необходимости
  type VirtualRowProps = { index: number; style: React.CSSProperties };
  type VirtualListCmp = React.ComponentType<{
    height: number | string;
    width: number | string;
    itemCount: number;
    itemSize: number;
    style?: React.CSSProperties;
    children: (props: VirtualRowProps) => React.ReactNode;
  }> | null;
  type ReactWindowModule = { FixedSizeList: VirtualListCmp };
  const [VirtualList, setVirtualList] = useState<VirtualListCmp>(null);
  useEffect(() => {
    if (isOpen && filtered.length > virtualizeThreshold && !VirtualList) {
      import('react-window')
        .then((mod: unknown) => {
          const m = mod as ReactWindowModule;
          setVirtualList(() => m.FixedSizeList);
        })
        .catch(() => setVirtualList(null));
    }
  }, [VirtualList, filtered.length, isOpen, virtualizeThreshold]);

  const rootCls = clsx(
    styles.root,
    fullWidth && styles.fullWidth,
    className,
    styles[size],
    isOpen && styles.open
  );
  const triggerCls = clsx(
    styles.trigger,
    internal.length === 0 && styles.placeholder,
    error && styles.error
  );

  const menuCls = clsx(styles.menu, fit === 'trigger' && styles.fitTrigger);

  return (
    <div
      className={rootCls}
      ref={rootRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns={menuId}
      aria-controls={menuId}
      aria-activedescendant={activeIndex >= 0 ? getItemId(activeIndex) : undefined}
    >
      {label && (
        <label htmlFor={triggerId} className={clsx(styles.label, required && styles.required)}>
          {label}
        </label>
      )}

      <div className={clsx(styles.container, isOpen && styles.containerOpen)}>
        {enableSearch ? (
          <div className={triggerCls} role="presentation">
            <input
              id={triggerId}
              className={styles.input}
              placeholder={placeholderText}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              aria-controls={menuId}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
            />
            <button
              type="button"
              aria-label="Открыть список"
              className={clsx(styles.icon, isOpen && styles.iconOpen)}
              onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
              onClick={() => setOpen(!isOpen)}
            >
              <Icon name="chevron-down" size={20} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            id={triggerId}
            type="button"
            className={triggerCls}
            aria-label={ariaLabel || label}
            aria-controls={menuId}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            disabled={disabled}
            onClick={() => setOpen(!isOpen)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span>{placeholderText}</span>
            <Icon
              name="chevron-down"
              size={20}
              className={clsx(styles.icon, isOpen && styles.iconOpen)}
              aria-hidden="true"
            />
          </button>
        )}

        {isOpen && (
          <DropdownProvider value={ctxValue}>
            <div
              id={menuId}
              ref={menuRef}
              className={clsx(menuCls, styles.menuOpen)}
              role="listbox"
              aria-labelledby={triggerId}
              aria-activedescendant={activeIndex >= 0 ? getItemId(activeIndex) : undefined}
              style={{ maxHeight: menuMaxHeight }}
              onKeyDown={handleMenuKeyDown}
              tabIndex={-1}
            >
              {children ? (
                children
              ) : (
                <>
                  <Dropdown.Menu>
                    {filtered.length === 0 ? (
                      <div className={styles.option} aria-disabled>
                        Ничего не найдено
                      </div>
                    ) : filtered.length > virtualizeThreshold && VirtualList ? (
                      <VirtualList
                        height={Math.min(menuMaxHeight, itemSize * virtualizeThreshold)}
                        width="100%"
                        itemCount={filtered.length}
                        itemSize={itemSize}
                        style={{ overflowX: 'hidden' }}
                      >
                        {({ index, style }: VirtualRowProps) => (
                          <div style={style}>
                            <Dropdown.Item option={filtered[index]} index={index} />
                          </div>
                        )}
                      </VirtualList>
                    ) : (
                      filtered.map((o, i) => <Dropdown.Item key={o.value} option={o} index={i} />)
                    )}
                  </Dropdown.Menu>
                </>
              )}
            </div>
          </DropdownProvider>
        )}
      </div>

      {hint && !error && <div className={styles.hint}>{hint}</div>}
      {error && errorMessage && (
        <div className={styles.errorMsg} role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const Trigger: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (props) => {
  const { triggerId, menuId, isOpen, disabled } = useDropdownContext();
  return (
    <button
      id={triggerId}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={menuId}
      disabled={disabled}
      {...props}
    />
  );
};

const Menu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const Item: React.FC<{ option: Option; index?: number }> = ({ option, index }) => {
  const { value, onItemSelect, multiple, getItemId } = useDropdownContext();
  const selected = value.includes(option.value);
  const disabled = !!option.disabled;

  const cbAreaRef = useRef<HTMLSpanElement | null>(null);

  const onRowClick = (e?: React.MouseEvent) => {
    if (multiple) {
      const target = e?.target as Node | undefined;
      if (target && cbAreaRef.current && cbAreaRef.current.contains(target)) {
        // клик пришёл из области чекбокса/лейбла — уже обработается через onChange
        return;
      }
    }
    if (!disabled) onItemSelect(option.value);
  };

  const onCheckboxChange: TCheckBoxUIProps['onChange'] = (e) => {
    e.stopPropagation();
    if (!disabled) onItemSelect(option.value);
  };

  return (
    <div
      id={typeof index === 'number' ? getItemId(index) : undefined}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      className={styles.option}
      onClick={onRowClick}
    >
      {multiple ? (
        <span ref={cbAreaRef}>
          <CheckBoxUI
            label={String(option.label)}
            checked={selected}
            disabled={disabled}
            onChange={onCheckboxChange}
            size="md"
          />
        </span>
      ) : (
        <span>{option.label}</span>
      )}
    </div>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
// Экспортируем Checkbox как подкомпонент (обёртка)
Dropdown.Checkbox = ((
  props: Pick<TCheckBoxUIProps, 'checked' | 'label' | 'onChange' | 'disabled'>
) => <CheckBoxUI size="md" {...props} />) as React.FC<
  Pick<TCheckBoxUIProps, 'checked' | 'label' | 'onChange' | 'disabled'>
>;

Dropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'] as const),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  multiple: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  hint: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  renderDisplay: PropTypes.func,
  enableSearch: PropTypes.bool,
  searchDebounceMs: PropTypes.number,
  fit: PropTypes.oneOf(['content', 'trigger'] as const),
};

// Удаляем дефолтный экспорт во избежание дубликатов экспортов
// export default Dropdown;
