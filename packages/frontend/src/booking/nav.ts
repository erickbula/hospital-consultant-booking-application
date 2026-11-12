import { useSyncExternalStore } from 'react';

export const PAGES = [
  'day',
  'week',
  'month',
  'new-booking',
  'consultants',
  'add-consultant',
  'patients',
  'waiting-list',
  'rooms',
  'reports',
] as const;

export type Page = (typeof PAGES)[number];

export const href = (page: Page): string => `#/${page}`;

export function pageFromHash(hash: string): Page {
  const key = hash.replace(/^#\/?/, '');
  return (PAGES as readonly string[]).includes(key) ? (key as Page) : 'day';
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

/** The current screen, kept in the URL hash so back, forward and reload work. */
export function usePage(): Page {
  return useSyncExternalStore(subscribe, () =>
    pageFromHash(window.location.hash)
  );
}
