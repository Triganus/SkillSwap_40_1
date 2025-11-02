# Dropdown (Compound)

Полнофункциональный выпадающий список с одним и множественным выбором, поиском, клавиатурной навигацией и виртуализацией.

- Controlled/Uncontrolled режимы
- Подкомпоненты: Trigger, Menu, Item, Search, Checkbox
- a11y: combobox, listbox, aria-activedescendant, клавиши Enter/Space/Escape/ArrowUp/ArrowDown
- Производительность: debounce 300ms, react-window для списков >100

## API

### <Dropdown />
Props:
- id?: string
- label?: string
- ariaLabel?: string
- placeholder?: string
- size?: 'small' | 'medium' | 'large'
- disabled?: boolean
- required?: boolean
- fullWidth?: boolean
- className?: string
- options?: { value: string; label: React.ReactNode; disabled?: boolean }[]
- multiple?: boolean
- value?: string | string[]
- defaultValue?: string | string[]
- onChange?: (v: string | string[]) => void
- open?: boolean
- defaultOpen?: boolean
- onOpenChange?: (open: boolean) => void
- hint?: string
- error?: boolean
- errorMessage?: string
- renderDisplay?: (selected: Option[], placeholder: string) => React.ReactNode
- virtualizeThreshold?: number
- itemSize?: number
- menuMaxHeight?: number

### Compound
- Dropdown.Trigger
- Dropdown.Menu
- Dropdown.Item
- Dropdown.Search
- Dropdown.Checkbox

## Примеры
См. `Dropdown.stories.tsx` — 4 варианта из макетов.

