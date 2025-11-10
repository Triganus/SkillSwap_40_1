import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '@shared/hooks';
import styles from './Popover.module.scss';

interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({ trigger, content, isOpen: controlledIsOpen, onOpenChange }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  useClickOutside([triggerRef, contentRef], () => setIsOpen(false), isOpen);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, setIsOpen]);

  const [position, setPosition] = useState<{
    top: number;
    left: number | null;
    right: number | null;
  }>({
    top: 0,
    left: null,
    right: null
  });

  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      const MARGIN = 20;

      let top = triggerRect.bottom + MARGIN;
      let left: number | null = null;
      let right: number | null = null;

      // Выравниваем по правому краю триггера
      const rightEdgeDistance = viewportWidth - triggerRect.right;

      // Проверяем, влезает ли меню, если выровнять по правому краю триггера
      if (triggerRect.right - contentRect.width >= MARGIN) {
        right = rightEdgeDistance;
      } else if (triggerRect.left + contentRect.width <= viewportWidth - MARGIN) {
        // Меню не влезает справа, но влезает слева от триггера
        left = triggerRect.left;
      } else {
        // Меню не влезает полностью, прижимаем к правому краю экрана с отступом
        right = MARGIN;
      }

      // Проверяем, влезает ли меню снизу
      if (top + contentRect.height > viewportHeight - MARGIN) {
        top = triggerRect.top - contentRect.height - MARGIN;

        // Если и сверху не влезает, прижимаем к низу экрана
        if (top < MARGIN) {
          top = viewportHeight - contentRect.height - MARGIN;
        }
      }

      // Проверяем, не выходит ли за верхнюю границу
      if (top < MARGIN) {
        top = MARGIN;
      }

      setPosition({
        top,
        left,
        right,
      });
    }
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={contentRef}
            className={styles.popover}
            style={{
              top: `${position.top}px`,
              ...(position.left !== null ? { left: `${position.left}px` } : {}),
              ...(position.right !== null ? { right: `${position.right}px` } : {}),
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};
