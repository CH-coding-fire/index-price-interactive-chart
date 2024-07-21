export interface Data {
    date: string;
    DJIA: string;
    DJIA_return: string;
    Nasdaq_Composite_Index: string;
    Nasdaq_Composite_Index_return: string;
    S_P500: string;
    S_P500_return: string;
    Nasdaq_100: string;
    Nasdaq_100_return: string;
    HSI: string;
    HSI_return: string;
    SH: string;
    SH_return: string;
    BTC: string;
    BTC_return: string;
}

export interface TransformedData {
    date: string;
    DJIA: number;
    DJIA_return: number;
    Nasdaq_Composite_Index: number;
    Nasdaq_Composite_Index_return: number;
    S_P500: number;
    S_P500_return: number;
    Nasdaq_100: number;
    Nasdaq_100_return: number;
    HSI: number;
    HSI_return: number;
    SH: number;
    SH_return: number;
    BTC: number;
    BTC_return: number;
}

const toNumber = (value: string): number => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : parseFloat(number.toFixed(1));
};

const fillMissingData = (dataArray: Data[]): Data[] => {
    return dataArray.map((data, index) => {
        // If the current data point is missing, check previous and next points
        if (
            data.DJIA === "" || data.DJIA_return === "" ||
            data.Nasdaq_Composite_Index === "" || data.Nasdaq_Composite_Index_return === "" ||
            data.S_P500 === "" || data.S_P500_return === "" ||
            data.Nasdaq_100 === "" || data.Nasdaq_100_return === "" ||
            data.HSI === "" || data.HSI_return === "" ||
            data.SH === "" || data.SH_return === "" ||
            data.BTC === "" || data.BTC_return === ""
        ) {
            const prevData = dataArray[index - 1];
            const nextData = dataArray[index + 1];

            // Check if both previous and next data points are available
            if (prevData && nextData) {
                return {
                    date: data.date,
                    DJIA: data.DJIA || prevData.DJIA,
                    DJIA_return: data.DJIA_return || prevData.DJIA_return,
                    Nasdaq_Composite_Index: data.Nasdaq_Composite_Index || prevData.Nasdaq_Composite_Index,
                    Nasdaq_Composite_Index_return: data.Nasdaq_Composite_Index_return || prevData.Nasdaq_Composite_Index_return,
                    S_P500: data.S_P500 || prevData.S_P500,
                    S_P500_return: data.S_P500_return || prevData.S_P500_return,
                    Nasdaq_100: data.Nasdaq_100 || prevData.Nasdaq_100,
                    Nasdaq_100_return: data.Nasdaq_100_return || prevData.Nasdaq_100_return,
                    HSI: data.HSI || prevData.HSI,
                    HSI_return: data.HSI_return || prevData.HSI_return,
                    SH: data.SH || prevData.SH,
                    SH_return: data.SH_return || prevData.SH_return,
                    BTC: data.BTC || prevData.BTC,
                    BTC_return: data.BTC_return || prevData.BTC_return,
                };
            }
        }
        return data;
    });
};

export function convertDataType(dataArray: Data[]): TransformedData[] {
    const filledDataArray = fillMissingData(dataArray);

    return filledDataArray.map(data => ({
        date: data.date,
        DJIA: toNumber(data.DJIA),
        DJIA_return: toNumber(data.DJIA_return),
        Nasdaq_Composite_Index: toNumber(data.Nasdaq_Composite_Index),
        Nasdaq_Composite_Index_return: toNumber(data.Nasdaq_Composite_Index_return),
        S_P500: toNumber(data.S_P500),
        S_P500_return: toNumber(data.S_P500_return),
        Nasdaq_100: toNumber(data.Nasdaq_100),
        Nasdaq_100_return: toNumber(data.Nasdaq_100_return),
        HSI: toNumber(data.HSI),
        HSI_return: toNumber(data.HSI_return),
        SH: toNumber(data.SH),
        SH_return: toNumber(data.SH_return),
        BTC: toNumber(data.BTC),
        BTC_return: toNumber(data.BTC_return),
    }));
}

