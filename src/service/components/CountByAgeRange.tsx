import { ApexOptions } from "apexcharts";
import getApiData from "../api/fetchApiData";

export async function mountColumnCountByAgeRange(setAgeRangeCategories: Function, yearSelected: string, agravoSelected: string, bairro?: string) {
    const bairroParam = bairro ? `&bairro=${bairro}` : '';
    const apiData = await getApiData(`/notifications/count/ageRange?year=${yearSelected}&agravo=${agravoSelected}${bairroParam}`);

    const count = apiData.count;

    console.log("Count by age range:", count);

    const arrayData = [
      count['age0to1'],
      count['age2to3'],
      count['age4to5'],
      count['age6to7'],
      count['age8to9'],
      count['age10to19'],
      count['age20to29'],
      count['age30to39'],
      count['age40to49'],
      count['age50to59'],
      count['age60to69'],
      count['age70to79'],
      count['age80to89'],
      count['age90to99']
    ];

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
          categories: [
            '0 - 1', '2 - 3', '4 - 5', '6 - 7', '8 - 9',
            '10 - 19', '20 - 29', '30 - 39', '40 - 49',
            '50 - 59', '60 - 69', '70 - 79', '80 - 89', '90 - 99'
          ]
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