import React, { useEffect, useState } from 'react';
import AgravoLineChart from '../../components/Charts/AgravoLineChart';
import DefaultLayout from '../../layout/DefaultLayout';
import { ApexOptions } from 'apexcharts';
import { countByEpidemiologicalWeekOptions, mountAgravoLineData } from '../../service/components/EpidemiologicalWeek';
import InputDefault from '../../components/Forms/Inputs/InputDefault';
import DefaultButton from '../../components/Forms/Buttons/DefaultButton';

const lineChartOptionsByEpidemiologicalWeek: ApexOptions = countByEpidemiologicalWeekOptions();

const App: React.FC = () => {
  const [agravoLineSeries, setAgravoLineSeries] = useState<any>([])
  
  useEffect(() => {
    console.log("teste")
  }, [])

  return (
    <DefaultLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className='bg-red col-start-1 col-end-4 bg-white dark:bg-boxdark p-5'>
            <InputDefault
              label="Teste"
            />
            <InputDefault 
              label="Teste 2"
            />
            <InputDefault 
              label="Teste 3"
            />
            <InputDefault 
              label="Teste 3"
            />

            <div className='pt-1'>
              <DefaultButton
                disabled={false}
                loadingData={false}
                onClick={() => {}}
                buttonText='Enviar'
              />
            </div>
        </div>
        <div className="col-start-4 col-end-13">
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