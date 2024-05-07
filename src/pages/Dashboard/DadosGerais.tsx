import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import MapOne from '../../components/Maps/MapOne';
import DefaultLayout from '../../layout/DefaultLayout';
import DonutChart from '../../components/Charts/DonutChart';
import { ApexOptions } from 'apexcharts';
import ColumnGraphic from '../../components/Charts/ColumnGraphic';
import { countByEpidemiologicalWeekOptions, mountAgravoLineData } from '../../service/components/EpidemiologicalWeek';
import { countBySexoOptions, mountDonutCountBySexo } from '../../service/components/CountBySexo';
import { countByAgeRangeOptions, mountColumnCountByAgeRange } from '../../service/components/CountByAgeRange';

const lineChartOptionsByEpidemiologicalWeek: ApexOptions = countByEpidemiologicalWeekOptions();
const donutChartOptionsbySexo: ApexOptions = countBySexoOptions();
const columnGraphicOptions: ApexOptions = countByAgeRangeOptions();

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  const [countBySexoSeries, setCountBySexoSeries] = useState<any>([])
  const [ageRangeCategories, setAgeRangeCategories] = useState<any>([])

  useEffect(() => {
    mountAgravoLineData(setAgravoLineSeries);
    mountDonutCountBySexo(setCountBySexoSeries);
    mountColumnCountByAgeRange(setAgeRangeCategories);
  }, [])

  return (
    <DefaultLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-start-1 col-end-13">
          <AgravoLineChart 
            options={lineChartOptionsByEpidemiologicalWeek}
            series={agravoLineSeries}
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
            options={donutChartOptionsbySexo}
            series={countBySexoSeries}
          />
        </div>
        <MapOne />
      </div>
    </DefaultLayout>
  );
};

export default App;