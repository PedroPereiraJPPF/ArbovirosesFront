import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface DonutChartProps {
    chartTitle: string;
    options: ApexOptions;
    series: number[];
}

const DonutChart: React.FC<DonutChartProps> = ({chartTitle, options, series}) => {

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5 w-full h-full flex flex-col justify-between">
        <div className='flex flex-col justify-between md:flex-row items-center'>
          <div className='text-center text-black dark:text-white font-semibold text-lg'>
            { chartTitle } 
          </div>
        </div>
        <div className="mb-2">
            <div id="chartThree" className="mx-auto flex justify-center text-black dark:text-white">
            <ReactApexChart
                options={options}
                series={series}
                type="donut"
            />
            </div>
        </div>
    </div>
  );
};

export default DonutChart;
