import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DefaultLayout from '../../layout/DefaultLayout';
import { ApexOptions } from 'apexcharts';
import { previsionCasesOptions, mountPrevisionCasesData } from '../../service/components/GetPrevisionData';
import InputDefault from '../../components/Forms/Inputs/InputDefault';
import DefaultButton from '../../components/Forms/Buttons/DefaultButton';
import { postApiData } from '../../service/api/fetchApiData';
import YearMultiselect from '../../components/Forms/SelectGroup/MultiYearSelector';

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  const [years, setYears] = useState<string[]>(() => {
    return [new Date().getFullYear().toString()];
  }); 
  const [optionsForPrevisionCases, setOptionsForPrevisionCases] = useState<ApexOptions>({});
  const [rainfallIndex, setRainfallIndex] = useState('');
  const [airHumidity, setAirHumidity] = useState('');
  const [meanTemperature, setMeanTemperature] = useState('');
  const [dengueCases, setDengueCases] = useState('');
  const [categories, setCategories] = useState<string[]>([])

  function fetchPrevisionData() {
    const data = {
      rainfall_index: rainfallIndex,
      air_humidity: airHumidity,
      mean_temperature: meanTemperature,
      dengue_cases: dengueCases,
    };

    mountPrevisionCasesData(setAgravoLineSeries, setCategories, years, data);
  }

  useEffect(() => {
    fetchPrevisionData();
  }, [years])

  useEffect(() => {
    let previsionColor = "#4CAF50";
    let hasPrevisions = categories.includes("Previsão");

    if (hasPrevisions) {
      let previsionIndex = agravoLineSeries[0].data.length - 1

      if (agravoLineSeries[0].data[previsionIndex] >= agravoLineSeries[0].data[previsionIndex - 1] * 1.5) {
        previsionColor = "#FF4560"
      }
    }

    setOptionsForPrevisionCases(previsionCasesOptions(hasPrevisions, categories, previsionColor));
  }, [categories]);

  async function clearPrevisionData() {
    try {
      await postApiData('/clear', {}, 'POST', 'http://localhost:8000');
      setAgravoLineSeries([]);
    } catch (error) {
      console.error("Erro ao limpar dados de previsão:", error);
    }
  }
  
  return (
    <DefaultLayout>
      <div className='flex justify-center gap-x-2 items-center'>
        <YearMultiselect selectedYears={years} setSelectedYears={setYears}/>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:mt-6 md:flex-row md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <div className="bg-white dark:bg-boxdark p-5 flex-1 md:max-w-sm">
          <InputDefault label="Índice de precipitação" value={rainfallIndex} onChange={(e) => setRainfallIndex(e.target.value)} placeholder='0.0'/>
          <InputDefault label="Umidade do ar" value={airHumidity} onChange={(e) => setAirHumidity(e.target.value)} placeholder='0.0'/>
          <InputDefault label="Temperatura média" value={meanTemperature} onChange={(e) => setMeanTemperature(e.target.value)} placeholder='0.0'/>
          <InputDefault label="Casos de dengue" value={dengueCases} onChange={(e) => setDengueCases(e.target.value)} placeholder='0'/>

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