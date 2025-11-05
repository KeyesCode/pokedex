import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';

// Mock the README import
jest.mock('../README.md', () => 'mock-readme-url');

// Mock fetch to return synchronously
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('hello world'),
  } as Response),
);

// Suppress Ant Design Menu warnings (third-party component)
// eslint-disable-next-line no-console
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Warning: An update to ForwardRef')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

test('renders home page', async () => {
  let getByTestId: any;
  await act(async () => {
    const result = render(<App />);
    getByTestId = result.getByTestId;
  });

  await waitFor(
    () => {
      expect(getByTestId('MockReactMarkdown')).toBeInTheDocument();
    },
    { timeout: 1000 },
  );
});
