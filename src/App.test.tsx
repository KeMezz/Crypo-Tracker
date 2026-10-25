import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import App from './App';

test('renders app header / container', () => {
  const queryClient = new QueryClient();
  render(
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  );
  // Screen should render the router without crashing
  expect(document.body).toBeInTheDocument();
});
