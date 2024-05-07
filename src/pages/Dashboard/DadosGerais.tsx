import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import MapOne from '../../components/Maps/MapOne';
import DefaultLayout from '../../layout/DefaultLayout';
import { fetchApi } from '../../service/api/fetchApiData';
import DonutChart from '../../components/Charts/DonutChart';
import { ApexOptions } from 'apexcharts';
import ColumnGraphic from '../../components/Charts/ColumnGraphic';

const columnGraphicOptions: ApexOptions = {
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


const DonutChartOptions: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#E03C3C', '#8FD0EF'],
  labels: ['Homens', 'Mulheres'],
  legend: {
    show: true,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ]
};

const App: React.FC = () => {
  const [series, setSeries] = useState<any>([])
  const [countBySexoSeries, setCountBySexoSeries] = useState<any>([])
  const [ageRangeCategories, setAgeRangeCategories] = useState<any>([])

  async function mountColumnCountByAgeRange() {
    const apiData = await getApiData('/notifications/count/ageRange');

    const labels = apiData.labels;
    const count = apiData.count;

    const arrayData = [count[labels[0]], count[labels[1]], count[labels[2]], count[labels[3]], count[labels[4]], count[labels[5]], count[labels[6]]];

    setAgeRangeCategories([{
      name: "Contagem",  
      data: arrayData
    }])
  }

  async function mountDonutCountBySexo() {
    const apiData = await getApiData('/notifications/count/sexo')
    setCountBySexoSeries([apiData.masculine, apiData.feminine]);
  }

  async function mountAgravoLineData() {
    const apiData = await getApiData('/notifications/count/epidemiologicalWeek')

    const dengueData = apiData.dengue.map((data: any) => {
      return data.casesCount
    })

    const zikaData = apiData.zika.map((data: any) => {
      return data.casesCount
    })

    const chikungunyaData = apiData.chikungunya.map((data: any) => {
      return data.casesCount
    })
    
    const dataObject = [{
      name: "Dengue",
      data: dengueData
    }, {
      name: "Zika",
      data: zikaData
    }, {
      name: "Chikungunya",
      data: chikungunyaData
    }]

    setSeries(dataObject)
  }

  useEffect(() => {
    mountAgravoLineData();
    mountDonutCountBySexo();
    mountColumnCountByAgeRange();
  }, [])

  return (
    <DefaultLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-start-1 col-end-13">
          <AgravoLineChart 
            series={series}
          />
        </div>
        
        <div className='xl:col-start-1 xl:col-end-8 col-span-12'>
          <ColumnGraphic 
            title='Contagem de obitos por faixa etaria'
            options={columnGraphicOptions}
            series={ageRangeCategories}
          />
        </div>

        <div className='xl:col-start-8 xl:col-end-13 col-span-12'>
          <DonutChart 
            chartTitle='Contagem de casos por sexo'
            options={DonutChartOptions}
            series={countBySexoSeries}
          />
        </div>
        <MapOne />
      </div>
    </DefaultLayout>
  );
};

async function getApiData(uri: string)
{
  try {
    const response = await fetchApi(uri)
    const data = await response.json()
  
    return data.data
  } catch (error) {
    console.log(error)
  }
}

export default App;