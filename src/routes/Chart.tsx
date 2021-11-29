import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexCharts from 'react-apexcharts';
import styled from "styled-components";

interface ChartProps {
    coinId: string;
}

interface IHistory {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

const Container = styled.div``;

const Loader = styled.h3`
  font-size: 22px;
  text-align: center;
  padding: 40px 0;
`;

function Chart({ coinId }: ChartProps) {
    const { isLoading: loading, data } = useQuery<IHistory[]>([coinId, "history"], () =>
      fetchCoinHistory(coinId)
    );

  return (
    <Container>
      {loading ? (
        <Loader>Loading Charts...</Loader>
      ) : (
        <ApexCharts
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((item) => item.close),
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            grid: {
              show: false,
            },
            stroke: {
              curve: "smooth",
            },
            fill: {
              type: "gradient",
              gradient: {
                gradientToColors: ["#55efc4"],
                stops: [0, 100],
              },
            },
            colors: ["#6c5ce7"],
            xaxis: {
              categories: data?.map((item) => item.time_close),
              type: "datetime",
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
          }}
        />
      )}
    </Container>
  );
}

export default Chart;