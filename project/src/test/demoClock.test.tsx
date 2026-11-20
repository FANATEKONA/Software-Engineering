import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import App from '@/App';

vi.mock('@/data/demoData', async (importOriginal) => {
  const fixtures = await importOriginal<typeof import('@/data/demoData')>();
  return { ...fixtures, DEMO_NOW: 555 };
});

it('formats the configured demo clock in the banner', () => {
  render(<App />);

  expect(screen.getByText(/current time is fixed at/)).toHaveTextContent('fixed at 09:15.');
});
