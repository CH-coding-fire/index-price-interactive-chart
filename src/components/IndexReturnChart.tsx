import * as React from 'react';
import { useEffect, useState } from 'react';
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

// Function to find the starting index of consecutive valid data
const findStartingIndex = (data: TransformedData[], key: keyof TransformedData): number => {
    for (let i = 0; i < data.length; i++) {
        if (data[i][key] !== 0) {
            let isConsecutive = true;
            for (let j = i; j < i + 3 && j < data.length; j++) {
                if (data[j][key] === 0) {
                    isConsecutive = false;
                    break;
                }
            }
            if (isConsecutive) {
                return i;
            }
        }
    }
    return data.length;
};

const preprocessData = (data: TransformedData[]): TransformedData[] => {
    const keys: (keyof TransformedData)[] = [
        'DJIA_return',
        'Nasdaq_Composite_Index_return',
        'S_P500_return',
        'Nasdaq_100_return',
        'HSI_return',
        'SH_return',
        'BTC_return'
    ];

    const startIndexes = keys.map(key => findStartingIndex(data, key));
    const minStartIndex = Math.min(...startIndexes);

    return data.slice(minStartIndex);
};

export const IndexReturnChart = (props: Props) => {
    const interval = 4; // Display every 4th data point

    const initialRange: [number, number] = [0, props.data.length - 1];

    const [range, setRange] = useState<[number, number]>(initialRange);

    useEffect(() => {
        setRange([0, props.data.length - 1]);
    }, [props.data.length]);

    const preprocessedData = preprocessData(props.data);

    const filteredData = filterDataByRange(preprocessedData, range[0], range[1], interval);

    const chartData = {
        labels: filteredData.map((item) => item.date),
        datasets: [
            {
                label: "DJIA",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.DJIA_return * 100,
                    price: item.DJIA // Add the price data here
                })),
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "Nasdaq Composite Index",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.Nasdaq_Composite_Index_return * 100,
                    price: item.Nasdaq_Composite_Index // Add the price data here
                })),
                borderColor: "rgba(54,162,235,1)",
                backgroundColor: "rgba(54,162,235,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "S&P 500",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.S_P500_return * 100,
                    price: item.S_P500 // Add the price data here
                })),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "Nasdaq 100",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.Nasdaq_100_return * 100,
                    price: item.Nasdaq_100 // Add the price data here
                })),
                borderColor: "rgba(153,102,255,1)",
                backgroundColor: "rgba(153,102,255,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "HSI",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.HSI_return * 100,
                    price: item.HSI // Add the price data here
                })),
                borderColor: "rgba(255,159,64,1)",
                backgroundColor: "rgba(255,159,64,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
            {
                label: "Shanghai Index",
                data: filteredData.map((item) => ({
                    x: item.date,
                    y: item.SH_return * 100,
                    price: item.SH // Add the price data here
                })),
                borderColor: "rgba(255,206,86,1)",
                backgroundColor: "rgba(255,206,86,0.2)",
                pointRadius: 0,
                pointHoverRadius: 10,
                yAxisID: 'y1',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        animation: false, // Disable animation
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
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context:any) {
                        const label = context.dataset.label || '';
                        const value = context.raw.y;
                        const price = context.raw.price;
                        return `${label}: ${value}%, Price: ${price}`;
                    },
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
                max={preprocessedData.length - 1}
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
