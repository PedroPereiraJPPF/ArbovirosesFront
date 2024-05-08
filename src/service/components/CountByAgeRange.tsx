import { ApexOptions } from "apexcharts";
import getApiData from "../api/fetchApiData";

export async function mountColumnCountByAgeRange(setAgeRangeCategories: Function, yearSelected: string) {
    const apiData = await getApiData(`/notifications/count/ageRange?year=${yearSelected}`);

    const labels = apiData.labels;
    const count = apiData.count;

    const arrayData = [count[labels[0]], count[labels[1]], count[labels[2]], count[labels[3]], count[labels[4]], count[labels[5]], count[labels[6]]];

    setAgeRangeCategories([{
      name: "Contagem",  
      data: arrayData
    }])
  }

export function countByAgeRangeOptions(): ApexOptions {
    return {
        colors: ['#3C50E0', '#80CAEE'],
        chart: {
          fontFamily: 'Satoshi, sans-serif',
          type: 'bar',
          height: 335,
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
      
        responsive: [
          {
            breakpoint: 1536,
            options: {
              plotOptions: {
                bar: {
                  borderRadius: 0,
                  columnWidth: '25%',
                },
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            columnWidth: '25%',
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last',
          },
        },
        dataLabels: {
          enabled: false,
        },
      
        xaxis: {
          categories: ['0 - 10', '11 - 20', '21 - 30', '31 - 40', '41 - 50', '51 - 60', '> 60'],
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          fontFamily: 'Satoshi',
          fontWeight: 500,
          fontSize: '14px',
      
          markers: {
            radius: 99,
          },
        },
        fill: {
          opacity: 1,
        },
      };
}