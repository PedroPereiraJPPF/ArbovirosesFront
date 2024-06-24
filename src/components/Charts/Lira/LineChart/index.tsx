import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface LineChartData {
  options: ApexOptions;
  series: {
    name: string;
    data: number[];
  }[];
}

const LineChart: React.FC<LineChartData> = ({options, series}) => {

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8 w-full">
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
