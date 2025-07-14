import { ApexOptions } from "apexcharts";
import { postApiData } from "../api/fetchApiData";

export async function mountPrevisionCasesData(setAgravoLineSeries: Function, setCategories: Function, years: string[], data?: any) {

    let previsionData = null;

    if (data.dengue_cases != "" && data.rainfall_index != "" && data.air_humidity != "" && data.mean_temperature != "") {
        previsionData = await postApiData('/predict', data, 'POST', 'https://arboviroses-python.onrender.com');
    }

    const apiData = await postApiData('/notifications/count/byYears', years, 'POST');

    const processData = () => {
        let concatenatedData: number[] = [];
        let categories: string[] = [];
    
        Object.keys(apiData).forEach(year => {
          const months = Object.keys(apiData[year]);
          const midPoint = Math.floor(months.length / 2);
          
          months.forEach((month, index) => {
            concatenatedData.push(apiData[year][month]);
            if (index === 0 || index === months.length - 1) {
                categories.push("|");
                return;
            }

            if (index === midPoint) {
              categories.push(`${year}`);
              return;
            }

            categories.push(` `);
          });
        });
    
        return { concatenatedData, categories };
      };

    const { concatenatedData, categories } = processData();

    if (previsionData !== null) {
        concatenatedData.push(previsionData.chartData.series[0].data[0]);
        categories.push("Previsão");
    }

    const series = [{
        data: concatenatedData,
        name: "series"
    }];

    setCategories(categories);
    setAgravoLineSeries(series);
}


export function previsionCasesOptions(hasPrevisions: boolean, categories?: string[], previsionColor?: string): ApexOptions {
    const cat = Array.from({ length: 53 }, (_, index) => index + 1);
    
    const actualCategories = categories ?? cat;

    const discreteMarkers = hasPrevisions
        ? [{
            seriesIndex: 0,
            dataPointIndex: actualCategories.length - 1,
            fillColor: '#FFFFFF',
            strokeColor: previsionColor,
            size: 6
          }]
        : [];

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
            discrete: discreteMarkers,
            hover: {
                size: undefined,
                sizeOffset: 5,
            },
        },
        xaxis: {
            type: 'category',
            categories: actualCategories,
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
