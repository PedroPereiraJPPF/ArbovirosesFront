import { ApexOptions } from "apexcharts";
import getApiData from "../api/fetchApiData";

export async function mountColumnCountByAgeRange(setAgeRangeCategories: Function, yearSelected: string, agravoSelected: string) {
    const apiData = await getApiData(`/notifications/count/ageRange?year=${yearSelected}&agravo=${agravoSelected}`);

    const count = apiData.count;

    const arrayData = [count['age1to10'], count['age11to20'], count['age21to30'], count['age31to40'], count['age41to50'], count['age51to60'], count['age61to70'], count['age71to80'], count['age81to90'], count['age91to99']];

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
          categories: ['1 - 10', '11 - 20', '21 - 30', '31 - 40', '41 - 50', '51 - 60', '61 - 70', '71 - 80', '81 - 90', '91 - 99'],
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