import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface ColumnGraphicProps {
    title: string;
    options: ApexOptions;
    series: {
      name: string;
      data:number[];
    }[];
}

const ColumnGraphic: React.FC<ColumnGraphicProps> = ({title, options, series}) => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark lg:col-span-5">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            { title }
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ColumnGraphic;
