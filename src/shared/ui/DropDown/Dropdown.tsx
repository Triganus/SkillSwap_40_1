// filepath: /Users/dcrawe/Projects/Corses/YPracticum/SkillSwap_40_11/src/shared/ui/Dropdown/Dropdown.tsx
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

const useControllable = <T,>(controlled: T | undefined, defaultValue: T, onChange?: (v: T) => void) => {
  const [state, setState] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : state;
  const set = useCallback(
    (v: T) => {
      if (!isControlled) setState(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );
  return [value, set] as const;
};

export const Dropdown: React.FC<DropdownProps> & {
  Trigger: React.FC<React.HTMLAttributes<HTMLButtonElement>>;
  Menu: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Item: React.FC<{ option: Option; index?: number }>;
  Search: React.FC<{ placeholder?: string }>;
  Checkbox: React.FC<{ checked: boolean; 'aria-hidden'?: boolean }>; // внутренний чекбокс
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
    (v) => onChange?.(multiple ? v : v[0] ?? ''),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside([rootRef, menuRef], () => setOpen(false), isOpen);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return options;
    const q = debouncedQuery.toLowerCase();
    return options.filter((o) => String(o.label).toLowerCase().includes(q));
  }, [debouncedQuery, options]);

  const selectedOptions = useMemo(() => options.filter((o) => internal.includes(o.value)), [internal, options]);

  const onItemSelect = useCallback(
    (val: string) => {
      if (multiple) {
        const next = internal.includes(val) ? internal.filter((v) => v !== val) : [...internal, val];
        setInternal(next);
        // список остаётся открытым при мультиселекте
      } else {
        setInternal([val]);
        setOpen(false);
      }
    },
    [internal, multiple, setInternal, setOpen],
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
      if (!isOpen) setOpen(true);
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
      if (opt && !opt.disabled) onItemSelect(opt.value);
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
      query,
      setQuery,
      highlightedIndex: activeIndex,
      setHighlightedIndex: setActiveIndex,
      getItemId,
    }),
    [rootId, triggerId, menuId, size, disabled, required, multiple, isOpen, setOpen, placeholder, internal, setInternal, onItemSelect, options, query, activeIndex, setActiveIndex, getItemId],
  );

  const displayContent = useMemo(() => {
    if (renderDisplay) return renderDisplay(selectedOptions, placeholder);
    if (multiple) return selectedOptions.length ? `Выбрано: ${selectedOptions.length}` : placeholder;
    return selectedOptions[0]?.label ?? placeholder;
  }, [multiple, placeholder, renderDisplay, selectedOptions]);

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
  const [VirtualList, setVirtualList] = useState<VirtualListCmp>(null);
  useEffect(() => {
    if (isOpen && filtered.length > virtualizeThreshold && !VirtualList) {
      import('react-window')
        .then((m: { FixedSizeList: VirtualListCmp }) => setVirtualList(() => m.FixedSizeList))
        .catch(() => setVirtualList(null));
    }
  }, [VirtualList, filtered.length, isOpen, virtualizeThreshold]);

  const rootCls = clsx(styles.root, fullWidth && styles.fullWidth, className, styles[size]);
  const triggerCls = clsx(styles.trigger, internal.length === 0 && styles.placeholder, error && styles.error);

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
        <span>{displayContent}</span>
        <Icon name="chevron-down" size={20} className={clsx(styles.icon, isOpen && styles.iconOpen)} aria-hidden="true" />
      </button>

      <DropdownProvider value={ctxValue}>
        {isOpen && (
          <div
            id={menuId}
            ref={menuRef}
            className={styles.menu}
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
                <Dropdown.Search placeholder="Поиск..." />
                <Dropdown.Menu>
                  {filtered.length === 0 ? (
                    <div className={styles.option} aria-disabled>
                      Ничего не найдено
                    </div>
                  ) : filtered.length > virtualizeThreshold && VirtualList ? (
                    <VirtualList height={Math.min(menuMaxHeight, itemSize * virtualizeThreshold)} width="100%" itemCount={filtered.length} itemSize={itemSize} style={{ overflowX: 'hidden' }}>
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
        )}
      </DropdownProvider>

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
    <button id={triggerId} type="button" aria-haspopup="listbox" aria-expanded={isOpen} aria-controls={menuId} disabled={disabled} {...props} />
  );
};

const Menu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const Item: React.FC<{ option: Option; index?: number }> = ({ option, index }) => {
  const { value, onItemSelect, multiple, getItemId } = useDropdownContext();
  const selected = value.includes(option.value);
  const disabled = !!option.disabled;

  const onClick = () => {
    if (!disabled) onItemSelect(option.value);
  };

  return (
    <div
      id={typeof index === 'number' ? getItemId(index) : undefined}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      className={styles.option}
      onClick={onClick}
    >
      {multiple ? (
        <CheckBoxUI
          label={String(option.label)}
          checked={selected}
          disabled={disabled}
          onChange={() => onItemSelect(option.value)}
          size="md"
        />
      ) : (
        <span>{option.label}</span>
      )}
    </div>
  );
};

const Search: React.FC<{ placeholder?: string }> = ({ placeholder = 'Поиск' }) => {
  const { query, setQuery } = useDropdownContext();
  return (
    <div className={styles.search}>
      <input className={styles.input} placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Menu = Menu;
Dropdown.Item = Item;
Dropdown.Search = Search;
// Экспортируем Checkbox как подкомпонент (обёртка)
Dropdown.Checkbox = ((props: Pick<TCheckBoxUIProps, 'checked' | 'label' | 'onChange' | 'disabled'>) => (
  <CheckBoxUI size="md" {...props} />
)) as React.FC<Pick<TCheckBoxUIProps, 'checked' | 'label' | 'onChange' | 'disabled'>>;

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
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  hint: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  renderDisplay: PropTypes.func,
};

// Удаляем дефолтный экспорт во избежание дубликатов экспортов
// export default Dropdown;
