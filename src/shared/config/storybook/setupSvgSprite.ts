import { registerSvgSprite, type RawSpriteModules } from '../../lib/svg/sprite';

const modules = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as RawSpriteModules;

export function setupSvgSprite(): void {
  registerSvgSprite(modules, {
    prefix: 'icon',
    viewBox: '0 0 24 24',
  });
}

setupSvgSprite();
