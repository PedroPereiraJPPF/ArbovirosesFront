import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DefaultLayout from '../../layout/DefaultLayout';
import { ApexOptions } from 'apexcharts';
import { previsionCasesOptions, mountPrevisionCasesData } from '../../service/components/GetPrevisionData';
import InputDefault from '../../components/Forms/Inputs/InputDefault';
import DefaultButton from '../../components/Forms/Buttons/DefaultButton';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';
import { postApiData } from '../../service/api/fetchApiData';

const optionsForPrevisionCases: ApexOptions = previsionCasesOptions();

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });
  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });

  const [rainfallIndex, setRainfallIndex] = useState('');
  const [airHumidity, setAirHumidity] = useState('');
  const [meanTemperature, setMeanTemperature] = useState('');
  const [dengueCases, setDengueCases] = useState('');

  function fetchPrevisionData() {
    const data = {
      rainfall_index: rainfallIndex,
      air_humidity: airHumidity,
      mean_temperature: meanTemperature,
      dengue_cases: dengueCases,
    };

    mountPrevisionCasesData(setAgravoLineSeries, data);
  }

  async function clearPrevisionData() {
    try {
      await postApiData('/clear', {}, 'POST', 'http://localhost:8000');
      setAgravoLineSeries([]);
    } catch (error) {
      console.error("Erro ao limpar dados de previsão:", error);
    }
  }
  
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
          <InputDefault label="Índice de precipitação" value={rainfallIndex} onChange={(e) => setRainfallIndex(e.target.value)} />
          <InputDefault label="Humidade do ar" value={airHumidity} onChange={(e) => setAirHumidity(e.target.value)} />
          <InputDefault label="Temperatura média" value={meanTemperature} onChange={(e) => setMeanTemperature(e.target.value)} />
          <InputDefault label="Casos de dengue" value={dengueCases} onChange={(e) => setDengueCases(e.target.value)} />

        <div className="pt-1 flex gap-2">
          <DefaultButton
              disabled={false}
              loadingData={false}
              onClick={clearPrevisionData}
              buttonText="Limpar Dados"
            />
          <DefaultButton
            disabled={false}
            loadingData={false}
            onClick={fetchPrevisionData}
            buttonText="Enviar"
          />
        </div>
      </div>
      
      <div className="flex-1 h-full mt-4 md:mt-0">
        <AgravoLineChart 
          options={optionsForPrevisionCases}
          series={agravoLineSeries}
        />
      </div>
    </div>
    </DefaultLayout>
  );
};

export default App;