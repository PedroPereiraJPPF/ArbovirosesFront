import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DefaultLayout from '../../layout/DefaultLayout';
import DonutChart from '../../components/Charts/DonutChart';
import { ApexOptions } from 'apexcharts';
import ColumnGraphic from '../../components/Charts/ColumnGraphic';
import { countByEpidemiologicalWeekOptions, mountAgravoLineData } from '../../service/components/EpidemiologicalWeek';
import { countBySexoOptions, mountDonutCountBySexo } from '../../service/components/CountBySexo';
import { countByAgeRangeOptions, mountColumnCountByAgeRange } from '../../service/components/CountByAgeRange';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import AgravoAccumulatedLineChart from '../../components/Charts/AgravoAccumulatedLineChart';
import { countByEpidemiologicalWeekAccumulatedOptions, mountAgravoLineAccumulatedData } from '../../service/components/EpidemiologicalWeekAccumulated';
import { CountCard } from '../../components/Cards/CountCard';
import { affectedNeighborhoodCount } from '../../service/components/affectedNeighborhoodCount';
import { notificationsCountData } from '../../service/components/notificationsCount';
import BaseTable from '../../components/Tables/BaseTable';
import { mountNeighborhoodData } from '../../service/components/NeighborhoodInfoTable';
import { NeighborhoodInfo } from '../../components/Entity/NeighborhoodInfo';

const lineChartOptionsByEpidemiologicalWeek: ApexOptions = countByEpidemiologicalWeekOptions();
const lineChartOptionsByEpidemiologicalWeekAccumulated: ApexOptions = countByEpidemiologicalWeekAccumulatedOptions();
const donutChartOptionsbySexo: ApexOptions = countBySexoOptions();
const columnGraphicOptions: ApexOptions = countByAgeRangeOptions();

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  const [agravoLineAccumulatedSeries, setAgravoLineAccumulatedSeries] = useState<any>([])
  const [countBySexoSeries, setCountBySexoSeries] = useState<any>([])
  const [ageRangeCategories, setAgeRangeCategories] = useState<any>([])
  const [affectedNeighborhoods, setAffectedNeighborhoods] = useState<any>(0)
  const [notificationsCount, setNotificationsCount] = useState<any>(0)
  const [neighborhoodApiData, setNeighborhoodApiData] = useState<NeighborhoodInfo[]>([])
  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });
  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });
  
  useEffect(() => {
    mountAgravoLineData(setAgravoLineSeries, yearSelected, agravoSelected);
    mountAgravoLineAccumulatedData(setAgravoLineAccumulatedSeries, yearSelected, agravoSelected);
    mountDonutCountBySexo(setCountBySexoSeries, yearSelected, agravoSelected);
    mountColumnCountByAgeRange(setAgeRangeCategories, yearSelected, agravoSelected);
    mountNeighborhoodData(setNeighborhoodApiData, yearSelected, agravoSelected);
    affectedNeighborhoodCount(setAffectedNeighborhoods, yearSelected, agravoSelected);
    notificationsCountData(setNotificationsCount, yearSelected, agravoSelected);
    localStorage.setItem('yearSelected', yearSelected);
    localStorage.setItem('agravoSelected', agravoSelected);
  }, [yearSelected, agravoSelected])

  return (
    <DefaultLayout>
      <div className='flex justify-end gap-x-2 items-center'>
        <YearSelector 
          yearSelected={yearSelected}
          setYearSelected={setYearSelected}
        />
        <AgravoSelector 
          agravoSelected={agravoSelected}
          setAgravoSelected={setAgravoSelected}
        />
      </div>
      <div className='flex flex-col md:flex-row gap-4'>
        <CountCard
          title="Notificações"
          count={notificationsCount}
        />
        <CountCard 
          title="Bairros afetados"
          count={affectedNeighborhoods}
        /> 
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-start-1 col-end-13">
          <AgravoLineChart 
            options={lineChartOptionsByEpidemiologicalWeek}
            series={agravoLineSeries}
          />
        </div>
        <div className="col-start-1 col-end-13">
          <AgravoAccumulatedLineChart 
            options={lineChartOptionsByEpidemiologicalWeekAccumulated}
            series={agravoLineAccumulatedSeries}
          />
        </div>

        <div className='xl:col-start-1 xl:col-end-8 col-span-12'>
          <ColumnGraphic 
            title='Contagem de casos por faixa etaria'
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
        <div className='xl:col-start-1 xl:col-end:13 col-span-12'>
          <BaseTable 
            neighborhoodData={neighborhoodApiData}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default App;