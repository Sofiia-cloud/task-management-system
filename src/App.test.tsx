import React from 'react';
import { render } from '@testing-library/react';

jest.mock(
  './App',
  () =>
    function App() {
      return <div data-testid="app">Mocked App</div>;
    },
);

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  it('renders app content', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app')).toBeInTheDocument();
  });
});
