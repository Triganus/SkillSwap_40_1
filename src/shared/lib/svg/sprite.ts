export type RawSpriteModules = Record<string, string>;

export interface SpriteOptions {
  prefix?: string;
  viewBox?: string;
  wrapperId?: string;
  spriteId?: string;
}

const DEFAULT_OPTIONS: Required<SpriteOptions> = {
  prefix: 'icon',
  viewBox: '0 0 24 24',
  wrapperId: '__local-svg-wrapper__',
  spriteId: '__local-svg-sprite__',
};

const sanitize = (raw: string): string =>
  raw
    .replace(/<svg[^>]*>|<\/svg>/g, '')
    .replace(/\s(fill|stroke|style|class|data-name|width|height)=(["'])[^"']*(["'])/g, '')
    .trim();

export function registerSvgSprite(modules: RawSpriteModules, opts?: SpriteOptions): void {
  const { prefix, viewBox, wrapperId, spriteId } = { ...DEFAULT_OPTIONS, ...opts };

  // HMR/повторный импорт: не дублировать спрайт
  if (document.getElementById(wrapperId)) return;

  const wrapper = document.createElement('div');

  wrapper.id = wrapperId;
  wrapper.style.display = 'none';
  wrapper.setAttribute('aria-hidden', 'true');

  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  sprite.id = spriteId;
  sprite.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  sprite.setAttribute('style', 'display:none');

  Object.entries(modules).forEach(([path, raw]) => {
    try {
      const name = path.split('/').pop()?.replace('.svg', '') ?? '';
      const content = sanitize(String(raw));
      const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');

      symbol.setAttribute('id', `${prefix}-${name}`);
      symbol.setAttribute('viewBox', viewBox);
      symbol.innerHTML = content;
      sprite.appendChild(symbol);
    } catch {
      // ignore
    }
  });

  wrapper.appendChild(sprite);

  const mount = () => {
    if (!document.getElementById(wrapperId)) {
      document.body.appendChild(wrapper);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
}
