import * as React from 'react';
import {useEffect} from "react";
import Papa from 'papaparse';
import {IndexReturnChart} from "./IndexReturnChart";
import {convertDataType} from "../utils/convertDataType";

type Props = {

};
export const DataFeeder = (props: Props) => {
    const [data, setData] = React.useState<any>([]);
    useEffect(() => {
        fetchCSV(
            '/data/indexReturn.csv',
        );
    }, []);

    const fetchCSV = (filePath:string) => {
        fetch(filePath)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    complete: (result:any) => {
                        console.log(result.data)
                        console.log(convertDataType(result.data));
                        setData(convertDataType(result.data));
                    },
                    error: (error: { message: any; }) => {
                        console.error(error.message);
                    }
                });
            })
            .catch(error => console.error('Error fetching the CSV file:', error));
    };
    return (
        <div>
            <IndexReturnChart data={data} />
        </div>
    );
};