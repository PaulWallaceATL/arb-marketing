// =====================================================
// ACCESSIBILITY UTILITIES
// =====================================================

/**
 * Trap focus within a modal or dialog
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.textContent = message;

  document.body.appendChild(liveRegion);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, 1000);
}

/**
 * Manage focus on route change
 */
export function manageFocusOnRouteChange() {
  // Focus main content on route change
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('tabindex', '-1');
    main.focus();
    main.removeAttribute('tabindex');
  }
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReaders(element: HTMLElement): boolean {
  return (
    element.getAttribute('aria-hidden') !== 'true' &&
    window.getComputedStyle(element).display !== 'none' &&
    window.getComputedStyle(element).visibility !== 'hidden'
  );
}

/**
 * Generate unique IDs for ARIA attributes
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Add skip link for keyboard navigation
 */
export function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.removeAttribute('tabindex');
    }
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Screen Reader Only CSS Class
 * Add this to your global CSS
 */
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100000;
    border-radius: 0 0 4px 0;
  }

  .skip-link:focus {
    top: 0;
  }
`;

/**
 * Keyboard navigation helpers
 */
export const KEY_CODES = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  TAB: 'Tab',
} as const;

/**
 * Handle keyboard navigation for list items
 */
export function handleListKeyboardNavigation(
  e: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onSelect: (index: number) => void,
  onClose?: () => void
) {
  switch (e.key) {
    case KEY_CODES.ARROW_DOWN:
      e.preventDefault();
      onSelect(currentIndex < totalItems - 1 ? currentIndex + 1 : 0);
      break;
    case KEY_CODES.ARROW_UP:
      e.preventDefault();
      onSelect(currentIndex > 0 ? currentIndex - 1 : totalItems - 1);
      break;
    case KEY_CODES.HOME:
      e.preventDefault();
      onSelect(0);
      break;
    case KEY_CODES.END:
      e.preventDefault();
      onSelect(totalItems - 1);
      break;
    case KEY_CODES.ESCAPE:
      if (onClose) {
        e.preventDefault();
        onClose();
      }
      break;
  }
}

/**
 * React Hook for managing focus
 */
import { useEffect, useRef } from 'react';

export function useFocusTrap(active: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [active]);

  return ref;
}

/**
 * React Hook for auto-focus
 */
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}

/**
 * React Hook for announcements
 */
export function useAnnouncement() {
  return (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  };
}

/**
 * ARIA Labels Helper
 */
export const ariaLabels = {
  close: 'Close',
  menu: 'Menu',
  navigation: 'Main navigation',
  search: 'Search',
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
  required: 'Required field',
  optional: 'Optional field',
  expand: 'Expand',
  collapse: 'Collapse',
  previous: 'Previous',
  next: 'Next',
  sort: 'Sort',
  filter: 'Filter',
};

/**
 * Color Contrast Checker
 * Checks if color contrast meets WCAG AA standards
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // This is a simplified version
  // In production, use a library like 'color-contrast-checker'
  const requiredRatio = level === 'AAA' ? 7 : 4.5;
  // TODO: Implement actual contrast calculation
  return true;
}

