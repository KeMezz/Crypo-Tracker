import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchAllCoins } from "../api";
import { Helmet } from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 0 14px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
`;

const ThemeBtn = styled.button`
  padding: 8px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => props.theme.box.boxBgColor};
  color: ${(props) => props.theme.box.boxTextColor};
  cursor: pointer;
  font-size: 22px;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  font-weight: 300;
  text-align: center;
  font-size: 38px;
  text-transform: uppercase;
  position: relative;
  color: ${(props) => props.theme.textColor.main};
  b {
    font-weight: 700;
  }
  &:after {
    content: "";
    position: absolute;
    width: 200px;
    height: 4px;
    left: 50%;
    bottom: -20px;
    transform: translate(-50%);
    background-color: ${(props) => props.theme.textColor.accent};
  }
`;

const AllCoins = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const Coin = styled.li`
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 16px;
    background-color: ${(props) => props.theme.box.boxBgColor};
    color: ${(props) => props.theme.box.boxTextColor};
    padding: 20px;
    transition: background-color 0.2s ease-in-out;
    .coin___info {
      display: flex;
      align-items: center;
      gap: 12px;
      .coin___image {
        width: 30px;
      }
      .coin___name {
        font-size: 20px;
        font-weight: 400;
      }
    }
  }
  &:hover {
    a {
      background-color: ${(props) => props.theme.textColor.accent};
    }
  }
`;

interface CoinsDataInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const toggleDark = useSetRecoilState(isDarkAtom);
  const { isLoading: loading, data: coinsData } = useQuery<
    CoinsDataInterface[]
  >("allCoins", fetchAllCoins);

  return (
    <Container>
      <Helmet>
        <title>CRYPTO TRACKER</title>
      </Helmet>
      <Header>
        <ThemeBtn className="xi-moon" onClick={() => toggleDark((current) => !current)}></ThemeBtn>
        {loading ? (
          <Title>
            <b>now</b>loading...
          </Title>
        ) : (
          <Title>
            CRYPTO<b>TRACKER</b>
          </Title>
        )}
      </Header>
      <AllCoins>
        {coinsData?.slice(0, 100)?.map((item) => (
          <Coin key={item.id}>
            <Link
              to={`/${item.id}`}
              state={{
                name: item.name,
                id: item.id,
              }}
            >
              <div className="coin___info">
                <img
                  className="coin___image"
                  src={`https://cryptoicon-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`}
                  alt={`${item.name}`}
                />
                <p className="coin___name">{item.name}</p>
              </div>
              <i className="xi-angle-right"></i>
            </Link>
          </Coin>
        ))}
      </AllCoins>
    </Container>
  );
}

export default Coins;
