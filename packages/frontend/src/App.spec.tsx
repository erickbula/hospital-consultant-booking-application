import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import App from '@/App';
import { PAGES } from '@/booking/nav';

function go(hash: string) {
  window.location.hash = hash;
  act(() => {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

describe('App', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('opens on the day calendar', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Wednesday 11 November 2026' })
    ).toBeVisible();
    expect(screen.getByText('Sample data')).toBeVisible();
  });

  it.each(PAGES)('renders the %s screen', (page) => {
    render(<App />);
    go(`#/${page}`);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('shows the selected booking when an appointment is picked', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: /14:30 F\. Moreau, New patient/ })
    );
    expect(screen.getByText('14:30 – 15:30 (60 min)')).toBeVisible();
  });

  it('removes a consultant after confirmation and can undo it', () => {
    render(<App />);
    go('#/consultants');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Dr Mei Tanaka' }));
    expect(screen.getByRole('dialog', { name: 'Remove consultant' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Remove consultant' }));
    expect(screen.queryByText('Consultant dermatologist')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByText('Consultant dermatologist')).toBeVisible();
  });
});
