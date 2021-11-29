import { useLocation } from "react-router";
import styled from "styled-components";

const Container = styled.section`
  margin-top: 40px;
  margin-bottom: 20px;
`;

const PriceBox = styled.div`
  margin-top: 14px;
  border-radius: 16px;
  background-color: ${(props) => props.theme.textColor.main};
  color: #111;
  display: flex;
  padding: 26px;
  justify-content: space-between;
  align-items: center;
  h5 {
    font-size: 18px;
  }
  h3 {
    font-size: 26px;
  }
`;

function Price() {
  const {
    state: { priceNow, athPrice, percentFromAth, marketCap },
  } = useLocation();
  return (
    <Container>
      <PriceBox>
        <h5>Now</h5>
        <h3>${priceNow.toFixed(2)}</h3>
      </PriceBox>
      <PriceBox>
        <h5>All Time High (ATH)</h5>
        <h3>${athPrice.toFixed(2)}</h3>
      </PriceBox>
      <PriceBox>
        <h5>% From ATH</h5>
        <h3>{percentFromAth.toFixed(1)}%</h3>
      </PriceBox>
      <PriceBox>
        <h5>MC</h5>
        <h3>${marketCap}</h3>
      </PriceBox>
    </Container>
  );
}

export default Price;
