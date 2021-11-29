import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Route, Routes, useLocation, useMatch, useParams } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinPrice } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 0 14px;
`;

const GoHome = styled.div`
  padding-top: 40px;
  a {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    padding-bottom: 22px;
    color: ${(props) => props.theme.textColor.main};
    text-align: center;
    font-size: 22px;
    cursor: pointer;
    transition: color 0.2s ease-in;
    i {
      border: solid 2px;
      padding: 6px;
      border-radius: 50%;
    }
    &:hover {
      color: ${(props) => props.theme.textColor.accent};
    }
  }
`;

const Header = styled.header`
  padding: 40px 0;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  font-weight: 300;
  text-align: center;
  font-size: 40px;
  text-transform: uppercase;
  position: relative;
  color: ${(props) => props.theme.textColor.main};
  font-weight: 700;
  &:after {
    content: "";
    position: absolute;
    width: 80px;
    height: 4px;
    left: 50%;
    bottom: -20px;
    transform: translate(-50%);
    background-color: ${(props) => props.theme.textColor.accent};
  }
`;

const Loader = styled.h2`
  text-align: center;
  font-size: 22px;
`;

const Overview = styled.section`
  margin-bottom: 40px;
`;

const OverviewBox = styled.ul`
  display: flex;
  width: 100%;
  text-align: center;
  background-color: #111;
  padding: 4px 0;
  border-radius: 16px;
  li {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    padding: 14px 0;
    position: relative;
    &:first-child::after {
      visibility: hidden;
    }
    &::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 60%;
      background-color: ${(props) => props.theme.textColor.main};
    }
    h5 {
      font-size: 12px;
      font-weight: 400;
    }
    h3 {
      font-size: 22px;
      font-weight: 700;
    }
  }
`;

const OverviewPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 16px;
  border-radius: 16px;
  border: solid 5px #111;
  h5 {
    font-size: 12px;
    padding-bottom: 20px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 12px;
      left: 50%;
      width: 90%;
      transform: translate(-50%);
      height: 1px;
      background-color: ${(props) => props.theme.textColor.main};
    }
  }
  h3 {
    font-size: 26px;
  }
`;

const Desc = styled.div`
  padding: 40px 12px;
  h2 {
    font-size: 26px;
    padding-bottom: 16px;
    font-weight: 600;
  }
  p {
    font-size: 18px;
    line-height: 1.4;
  }
`;

const Tabs = styled.ul`
  margin-top: 40px;
  display: flex;
  text-align: center;
  gap: 12px;
  align-items: center;
`;

const Tab = styled.li<{ isActive: boolean }>`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  border-radius: 16px;
  background-color: transparent;
  border: solid 2px
    ${(props) =>
      props.isActive ? (props) => props.theme.textColor.accent : "#aaa"};
  a {
    padding: 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) =>
      props.isActive ? (props) => props.theme.textColor.main : "#999"};
  }
`;

interface IParams {
  coinId: string;
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams() as IParams;
  const { state } = useLocation();
  const priceMatch = useMatch(":coinId/price");
  const chartMatch = useMatch(":coinId/chart");

  const { isLoading: infoLoaing, data: infoData } = useQuery<IInfoData>(
    [coinId, "info"],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: priceLoaing, data: priceData } = useQuery<IPriceData>(
    [coinId, "price"],
    () => fetchCoinPrice(coinId),
    {
      refetchInterval: 5000,
    }
  );
  const loading = infoLoaing || priceLoaing;

  return (
    <Container>
      <Helmet>
        <title>{infoData?.name}</title>
      </Helmet>
      <Header>
        {loading ? (
          <Title>loading</Title>
        ) : (
          <Title>{state?.name || infoData?.name}</Title>
        )}
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Overview>
          <OverviewPrice>
            <h5>{infoData?.name} in USD</h5>
            <h3>${priceData?.quotes.USD.price}</h3>
          </OverviewPrice>
          <OverviewBox>
            <li>
              <h5>Rank</h5>
              <h3>{infoData?.rank}</h3>
            </li>
            <li>
              <h5>Symbol</h5>
              <h3>{infoData?.symbol}</h3>
            </li>
            <li>
              <h5>Open Source</h5>
              <h3>{infoData?.open_source ? "Yes" : "No"}</h3>
            </li>
          </OverviewBox>
          <Desc>
            <h2>What is {infoData?.name}?</h2>
            <p>
              {infoData?.description
                ? infoData?.description
                : "Sorry. We don't know well."}
            </p>
          </Desc>
          <OverviewBox>
            <li>
              <h5>Total Supply</h5>
              <h3>{priceData?.total_supply}</h3>
            </li>
            <li>
              <h5>Max Supply</h5>
              <h3>{priceData?.max_supply}</h3>
            </li>
          </OverviewBox>
          <Tabs>
            <Tab isActive={priceMatch ? true : false}>
              <Link
                to={`price`}
                state={{
                  priceNow: priceData?.quotes.USD.price,
                  athPrice: priceData?.quotes.USD.ath_price,
                  percentFromAth: priceData?.quotes.USD.percent_from_price_ath,
                  marketCap: priceData?.quotes.USD.market_cap,
                }}
              >
                Price
              </Link>
            </Tab>
            <Tab isActive={chartMatch ? true : false}>
              <Link to={`chart`}>Chart</Link>
            </Tab>
          </Tabs>
          <Routes>
            <Route path="/price" element={<Price />}></Route>
            <Route path="/chart" element={<Chart coinId={coinId} />}></Route>
          </Routes>
          <GoHome>
            <Link to="/">
              <i className="xi-arrow-left"></i>
              <h3>Back to List</h3>
            </Link>
          </GoHome>
        </Overview>
      )}
    </Container>
  );
}

export default Coin;
