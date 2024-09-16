import { ApexOptions } from "apexcharts";
import { postApiData } from "../api/fetchApiData";

export async function mountPrevisionCasesData(setAgravoLineSeries: Function, data: any) {
    const apiData = await postApiData('/predict', data, 'POST', 'http://localhost:8000');

    setAgravoLineSeries(apiData.chartData.series);
}

export function previsionCasesOptions() : ApexOptions {
    const categories = Array.from({length: 53}, (_, index) => index + 1);
    
    return {
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ['#3C50E0', '#80CAEE', '#79C657'],
        chart: {
            fontFamily: 'Satoshi, sans-serif',
            height: 335,
            type: 'area',
            dropShadow: {
            enabled: true,
            color: '#623CEA14',
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1,
            },
        
            toolbar: {
            show: true,
            tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
            }
            },
        },
        responsive: [
            {
            breakpoint: 1024,
            options: {
                chart: {
                height: 300,
                },
            },
            },
            {
            breakpoint: 1366,
            options: {
                chart: {
                height: 350,
                },
            },
            },
        ],
        stroke: {
            width: [2, 2],
            curve: 'straight',
        },
        // labels: {
        //   show: false,
        //   position: "top",
        // },
        grid: {
            xaxis: {
            lines: {
                show: true,
            },
            },
            yaxis: {
            lines: {
                show: true,
            },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 4,
            colors: '#fff',
            strokeColors: ['#3056D3', '#80CAEE', '#5F9E41'],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            hover: {
            size: undefined,
            sizeOffset: 5,
            },
        },
        xaxis: {
            type: 'category',
            categories: categories,
            axisBorder: {
            show: false,
            },
            axisTicks: {
            show: false,
            },
            title: {
            text: 'Previsão de Casos (Dengue)',
            style: {
                fontSize: '16px',
            },
            }
        }
    };
}