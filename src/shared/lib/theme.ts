export const THEME_LIGHT = 'light' as const;
export const THEME_DARK = 'dark' as const;
export const THEME_ATTR = 'data-theme' as const;
export const THEME_STORAGE_KEY = 'app_theme' as const;

export const THEMES = [THEME_LIGHT, THEME_DARK] as const;
export type Theme = (typeof THEMES)[number];

export function getStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);

    if (!raw) return null;

    const val = JSON.parse(raw) as Theme;

    return val === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  } catch {
    return null;
  }
}

export function setTheme(theme: Theme): void {
  const t: Theme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;

  document.documentElement.setAttribute(THEME_ATTR, t);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(t));
  } catch {
    /* ignore */
  }
}

export function getTheme(): Theme {
  const attr = document.documentElement.getAttribute(THEME_ATTR);

  return (attr === THEME_DARK ? THEME_DARK : THEME_LIGHT) satisfies Theme;
}

export function initTheme(): Theme {
  const stored = getStoredTheme();
  const resolved: Theme =
    stored ??
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT);

  setTheme(resolved);

  return resolved;
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK;

  setTheme(next);

  return next;
}
