import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import HeatMap from '../../components/Maps/HeatMap';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';
import { mountNeighborhoodData } from '../../service/components/NeighborhoodInfoTable';

const App: React.FC = () => {
  const [affectedNeighborhoods, setAffectedNeighborhoods] = useState<any>([])
  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });
  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });
  const cordsNeighborhoods: { [key: string]: number[] } = {
    'SANTO ANTÔNIO': [-5.1940, -37.3470],
    'ALTO DA CONCEIÇÃO': [-5.1910, -37.3450],
    'AEROPORTO': [-5.2010, -37.3220],
    'BARROCAS': [-5.1920, -37.3360],
    'BELO HORIZONTE': [-5.1890, -37.3240],
    'ALTO DO SUMARÉ': [-5.2040, -37.3660],
    'SANTA DELMIRA': [-5.1990, -37.3570],
    'PAREDÕES': [-5.1900, -37.3420],
    'NOVA BETÂNIA': [-5.1760, -37.3400],
    'BOM JARDIM': [-5.1830, -37.3300],
    'DOM JAIME CÂMARA': [-5.2010, -37.3540],
    'RINCÃO': [-5.2040, -37.3600],
    'SANTA JÚLIA': [-5.1950, -37.3400],
    'BOA VISTA': [-5.1840, -37.3410],
    'ALTO DE SÃO MANOEL': [-5.1950, -37.3550],
    'CENTRO': [-5.1850, -37.3420],
    'LAGOA DO MATO': [-5.1800, -37.3350],
    'BOM JESUS': [-5.2020, -37.3590],
    'DOZE ANOS': [-5.1820, -37.3380],
  };
  
  useEffect(() => {
    mountNeighborhoodData(setAffectedNeighborhoods, yearSelected, agravoSelected);
    localStorage.setItem('yearSelected', yearSelected);
    localStorage.setItem('agravoSelected', agravoSelected);    
  }, [yearSelected, agravoSelected]) 

  const heatData = affectedNeighborhoods.map((neighborhood: { nomeBairro: string | number; casosReportados: any; }) => {
    const coords = cordsNeighborhoods[neighborhood.nomeBairro];

    if (!coords) return null;

    const intensidade = neighborhood.casosReportados;
    return [...coords, intensidade];
  }).filter(Boolean);

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

      <div className='h-2/3'>
        <h1>Mapa de Calor de Mossoró</h1>
        <HeatMap data={heatData} />
      </div>
    </DefaultLayout>
  );
};

export default App;