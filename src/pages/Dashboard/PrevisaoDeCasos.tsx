import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DefaultLayout from '../../layout/DefaultLayout';
import { ApexOptions } from 'apexcharts';
import { countByEpidemiologicalWeekOptions, mountAgravoLineData } from '../../service/components/EpidemiologicalWeek';
import InputDefault from '../../components/Forms/Inputs/InputDefault';
import DefaultButton from '../../components/Forms/Buttons/DefaultButton';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';

const lineChartOptionsByEpidemiologicalWeek: ApexOptions = countByEpidemiologicalWeekOptions();

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });
  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });
  
  useEffect(() => {
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

      <div className="mt-4 flex flex-col gap-4 md:mt-6 md:flex-row md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <div className="bg-white dark:bg-boxdark p-5 flex-1 md:max-w-sm">
        <InputDefault label="Teste" />
        <InputDefault label="Teste 2" />
        <InputDefault label="Teste 3" />
        <InputDefault label="Teste 4" />

        <div className="pt-1">
          <DefaultButton
            disabled={false}
            loadingData={false}
            onClick={() => {}}
            buttonText="Enviar"
          />
        </div>
      </div>
      
      <div className="flex-1 h-full mt-4 md:mt-0">
        <AgravoLineChart 
          options={lineChartOptionsByEpidemiologicalWeek}
          series={agravoLineSeries}
        />
      </div>
    </div>
    </DefaultLayout>
  );
};

export default App;