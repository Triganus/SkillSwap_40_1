declare module '*.module.scss';
declare module '*.module.css';
declare module '*.scss';
declare module '*.css';

// Дополнительные декларации для импортов изображений (если нужно)
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
// Типы для импорта SVG как React компонентов через vite-plugin-svgr
declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
