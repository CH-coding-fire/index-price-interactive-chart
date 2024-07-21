import * as React from 'react';
import { useState } from 'react';
import { TransformedData } from "../utils/convertDataType";
import { Line } from "react-chartjs-2";
import ReactSlider from 'react-slider';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    data: TransformedData[]
};

// Function to filter data points to show only within a date range and every nth point
const filterDataByRange = (data: TransformedData[], start: number, end: number, interval: number): TransformedData[] => {
    return data.slice(start, end + 1).filter((_, index) => index % interval === 0);
};

// Function to find the first non-zero/non-missing value
const findFirstValidIndex = (data: TransformedData[]): number => {
    return data.findIndex(item => item.DJIA_return !== 0 || item.Nasdaq_Composite_Index_return !== 0 || item.S_P500_return !== 0 || item.Nasdaq_100_return !== 0 || item.HSI_return !== 0 || item.SH_return !== 0 || item.BTC_return !== 0);
};

export const IndexReturnChart = (props: Props) => {
    const [range, setRange] = useState<[number, number]>([0, props.data.length - 1]);
    const interval = 4; // Display every 10th data point

    // Find the first valid data index to start from there
    const firstValidIndex = findFirstValidIndex(props.data);
    const adjustedRange = [Math.max(range[0], firstValidIndex), range[1]];

    const filteredData = filterDataByRange(props.data, adjustedRange[0], adjustedRange[1], interval);

    const chartData = {
        labels: filteredData.map((item) => item.date),
        datasets: [
            {
                label: "DJIA Return",
                data: filteredData.map((item) => item.DJIA_return * 100),
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "Nasdaq Composite Index Return",
                data: filteredData.map((item) => item.Nasdaq_Composite_Index_return * 100),
                borderColor: "rgba(54,162,235,1)",
                backgroundColor: "rgba(54,162,235,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "S&P 500 Return",
                data: filteredData.map((item) => item.S_P500_return * 100),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "Nasdaq 100 Return",
                data: filteredData.map((item) => item.Nasdaq_100_return * 100),
                borderColor: "rgba(153,102,255,1)",
                backgroundColor: "rgba(153,102,255,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "HSI Return",
                data: filteredData.map((item) => item.HSI_return * 100),
                borderColor: "rgba(255,159,64,1)",
                backgroundColor: "rgba(255,159,64,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "SH Return",
                data: filteredData.map((item) => item.SH_return * 100),
                borderColor: "rgba(255,206,86,1)",
                backgroundColor: "rgba(255,206,86,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "BTC Return",
                data: filteredData.map((item) => item.BTC_return * 100),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        animation: true, // Disable animation
        scales: {
            x: {
                type: 'category' as const,
                labels: filteredData.map((item) => item.date),
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y1: {
                type: 'linear' as const,
                position: 'left',
                title: {
                    display: true,
                    text: 'Return %',
                },
                grid: {
                    drawOnChartArea: true,
                },
            },
        },
    };

    return (
        <div>
            <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                min={0}
                max={props.data.length - 1}
                value={range}
                onChange={(value) => setRange(value as [number, number])}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            />
            {/*@ts-ignore*/}
            <Line data={chartData} options={options} />
        </div>
    );
};
