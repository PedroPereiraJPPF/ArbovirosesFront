import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DonutChart from '../../components/Charts/DonutChart';
import { ApexOptions } from 'apexcharts';
import ColumnGraphic from '../../components/Charts/ColumnGraphic';
import { countByEpidemiologicalWeekOptions, mountAgravoLineData } from '../../service/components/EpidemiologicalWeek';
import { countBySexoOptions, mountDonutCountBySexo } from '../../service/components/CountBySexo';
import { countByAgeRangeOptions, mountColumnCountByAgeRange } from '../../service/components/CountByAgeRange';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import { CountCard } from '../../components/Cards/CountCard';
import { notificationsCountData } from '../../service/components/notificationsCount';
import { useParams } from 'react-router-dom';

const lineChartOptionsByEpidemiologicalWeek: ApexOptions = countByEpidemiologicalWeekOptions();
const donutChartOptionsbySexo: ApexOptions = countBySexoOptions();
const columnGraphicOptions: ApexOptions = countByAgeRangeOptions();

const DashboardBairro: React.FC = () => {
  const { bairro } = useParams();
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([]);
  const [countBySexoSeries, setCountBySexoSeries] = useState<any>([]);
  const [ageRangeCategories, setAgeRangeCategories] = useState<any>([]);
  const [notificationsCount, setNotificationsCount] = useState<any>(0);
  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });
  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });
  
  useEffect(() => {
    if (bairro) {
      mountAgravoLineData(setAgravoLineSeries, yearSelected, agravoSelected, bairro);
      mountDonutCountBySexo(setCountBySexoSeries, yearSelected, agravoSelected, bairro);
      mountColumnCountByAgeRange(setAgeRangeCategories, yearSelected, agravoSelected, bairro);
      notificationsCountData(setNotificationsCount, yearSelected, agravoSelected, bairro);
      localStorage.setItem('yearSelected', yearSelected);
      localStorage.setItem('agravoSelected', agravoSelected);
    }
  }, [yearSelected, agravoSelected, bairro]);

  return (
    <DefaultLayout>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold text-black dark:text-white'>
          Dados do Bairro: {bairro}
        </h1>
      </div>

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
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-start-1 col-end-13">
          <AgravoLineChart 
            options={lineChartOptionsByEpidemiologicalWeek}
            series={agravoLineSeries}
          />
        </div>

        <div className='xl:col-start-1 xl:col-end-8 col-span-12'>
          <ColumnGraphic 
            title='Contagem de casos por faixa etária'
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
      </div>
    </DefaultLayout>
  );
};

export default DashboardBairro;
