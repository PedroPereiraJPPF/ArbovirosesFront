import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LiraData {
  bairro: string;
  indiceInfestacaoPredial: number;
  indiceBreteau: number;
}

interface ChartLiraPorBairroProps {
  data: LiraData[];
}

const ChartLiraPorBairro: React.FC<ChartLiraPorBairroProps> = ({ data }) => {
  const validData = data.filter(d => d && d.bairro != null && d.indiceInfestacaoPredial != null && d.indiceBreteau != null);

  console.log(validData)

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: validData.map((d) => d.bairro),
      title: {
        text: 'Bairro',
      },
    },
    yaxis: {
      title: {
        text: 'Índice',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          if (typeof val === 'number') {
            return val.toFixed(2);
          }
          return val;
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  const series = [
    {
      name: 'Índice de Infestação Predial',
      data: validData.map((d) => d.indiceInfestacaoPredial),
    },
    {
      name: 'Índice de Bretau',
      data: validData.map((d) => d.indiceBreteau),
    },
  ];

  return (
    <div id="chartLiraPorBairro">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ChartLiraPorBairro;
