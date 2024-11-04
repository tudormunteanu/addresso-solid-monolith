import { render, screen, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should show loading message initially', () => {
    render(() => <App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should fetch and display message from API', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ message: 'Hello from API' }),
      ok: true,
    });

    render(() => <App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello from API')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/hello');
  });

  it('should handle API errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'));

    render(() => <App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Failed to load message. Please try again later.')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/hello');
  });
});