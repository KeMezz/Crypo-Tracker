// export async function fetchAllCoins() {
//     const response = await fetch("https://api.coinpaprika.com/v1/coins");
//     const json = await response.json();
//     return json;
// }

const BASE_URL = "https://api.coinpaprika.com/v1"

export function fetchAllCoins() {
    return fetch(`${BASE_URL}/coins`).then((response) =>
      response.json()
    );
}

export function fetchCoinInfo(coinId: string) {
  // if (coinId === "index.html") {
  //   coinId = 'btc-bitcoin'
  //   console.log('index.html == userID')  
  // }
  return fetch(`${BASE_URL}/coins/${coinId}`).then(
    (response) => response.json()
  );
}

export function fetchCoinPrice(coinId: string) {
  // if (coinId === "index.html") {
  //   coinId = 'btc-bitcoin'
  //   console.log('index.html == userID')  
  // }
  return fetch(`${BASE_URL}/tickers/${coinId}`).then(
    (response) => response.json()
  );
}

export function fetchCoinHistory(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7 * 2;
  return fetch(
    `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((response) => response.json());
}