import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import App from './App';

// Network is mocked: CoinPaprika responses are canned, everything else in the
// app (router, react-query, recoil, styled-components, helmet) is real.
const COINS = [
  { id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, is_new: false, is_active: true, type: 'coin' },
  { id: 'eth-ethereum', name: 'Ethereum', symbol: 'ETH', rank: 2, is_new: false, is_active: true, type: 'coin' },
];
const INFO = { ...COINS[0], description: 'Digital gold', open_source: true };
const TICKER = {
  id: 'btc-bitcoin', name: 'Bitcoin', symbol: 'BTC', rank: 1, total_supply: 19000000, max_supply: 21000000,
  quotes: { USD: { price: 65000.5, ath_price: 73000.25, percent_from_price_ath: -10.9, market_cap: 1234567 } },
};
const HISTORY = [{ close: '100', time_close: '2024-01-01T00:00:00Z' }, { close: '110', time_close: '2024-01-02T00:00:00Z' }];
const routes: Record<string, unknown> = {
  [`https://api.coinpaprika.com/v1/coins/btc-bitcoin/ohlcv/historical`]: HISTORY,
  'https://api.coinpaprika.com/v1/coins': COINS,
  'https://api.coinpaprika.com/v1/coins/btc-bitcoin': INFO,
  'https://api.coinpaprika.com/v1/tickers/btc-bitcoin': TICKER,
};

// ApexCharts needs a real SVG layout engine that jsdom does not provide; stub it
// and expose the series it receives so the data flow into the chart is still checked.
jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: (props: { series: { data: number[] }[] }) => (
    <div data-testid="apex-chart">{JSON.stringify(props.series[0].data)}</div>
  ),
}));

const renderApp = (path = '/') => {
  window.history.pushState({}, '', path);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

beforeEach(() => {
  // react-router >= 6.28 logs v7 future-flag notices; they are not part of what is tested here.
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  global.fetch = jest.fn((url: RequestInfo) => {
    const body = routes[String(url).split('?')[0]];
    return Promise.resolve({ ok: !!body, json: () => Promise.resolve(body) } as Response);
  }) as jest.Mock;
});

test('coin list loads from the API and links every coin to its detail route', async () => {
  renderApp();
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /crypto\s*tracker/i })).toBeInTheDocument();
  const bitcoin = screen.getByRole('link', { name: /bitcoin/i });
  expect(bitcoin).toHaveAttribute('href', '/btc-bitcoin');
  expect(screen.getByRole('link', { name: /ethereum/i })).toHaveAttribute('href', '/eth-ethereum');
  expect(global.fetch).toHaveBeenCalledWith('https://api.coinpaprika.com/v1/coins');
});

test('clicking a coin opens its detail page with price data and the Price tab', async () => {
  renderApp();
  userEvent.click(await screen.findByRole('link', { name: /bitcoin/i }));
  expect(await screen.findByText('Bitcoin in USD')).toBeInTheDocument();
  expect(screen.getByText('$65000.5')).toBeInTheDocument();
  expect(screen.getByText('What is Bitcoin?')).toBeInTheDocument();
  expect(screen.getByText('Digital gold')).toBeInTheDocument();
  expect(within(screen.getByText('Open Source').parentElement as HTMLElement).getByText('Yes')).toBeInTheDocument();
  userEvent.click(screen.getByRole('link', { name: 'Price' }));
  expect(await screen.findByText('All Time High (ATH)')).toBeInTheDocument();
  expect(screen.getByText('$73000.25')).toBeInTheDocument();
  expect(screen.getByText('-10.9%')).toBeInTheDocument();
});

test('Chart tab keeps resolving relative to the coin route and feeds history into the chart', async () => {
  renderApp('/btc-bitcoin');
  await screen.findByText('Bitcoin in USD');
  userEvent.click(screen.getByRole('link', { name: 'Price' }));
  expect(window.location.pathname).toBe('/btc-bitcoin/price');
  userEvent.click(screen.getByRole('link', { name: 'Chart' }));
  expect(await screen.findByTestId('apex-chart')).toHaveTextContent('["100","110"]');
  expect(window.location.pathname).toBe('/btc-bitcoin/chart');
});
