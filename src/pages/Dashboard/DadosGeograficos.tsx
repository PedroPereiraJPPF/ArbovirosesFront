import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import HeatMap from '../../components/Maps/HeatMap';
import AgravoSelector from '../../components/Forms/SelectGroup/AgravoSelector';
import YearSelector from '../../components/Forms/SelectGroup/YearSelector';
import { mountNeighborhoodData } from '../../service/components/NeighborhoodInfoTable';

const App: React.FC = () => {
  const [affectedNeighborhoods, setAffectedNeighborhoods] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [agravoSelected, setAgravoSelected] = useState<string>(() => {
    return localStorage.getItem('agravoSelected') || 'dengue';
  });

  const [yearSelected, setYearSelected] = useState<string>(() => {
    return localStorage.getItem('yearSelected') || new Date().getFullYear().toString();
  });

  const cordsNeighborhoods: { [key: string]: [number, number] } = {
    'ABOLIÇÃO': [-5.1870, -37.3440],
    'AEROPORTO': [-5.2010, -37.3220],
    'ALTO DA CONCEIÇÃO': [-5.1910, -37.3450],
    'ALTO DE SÃO MANOEL': [-5.210125, -37.33342],
    'BELO HORIZONTE': [-5.1890, -37.3240],
    'BOA VISTA': [-5.1840, -37.3410],
    'BOM JARDIM': [-5.1830, -37.3300],
    'BOM JESUS': [-5.2020, -37.3590],
    'BARROCAS': [-5.1920, -37.3360],
    'CENTRO': [-5.1850, -37.3420],
    'COSTA E SILVA': [-5.2040, -37.3580],
    'DIX-SEPT ROSADO': [-5.1930, -37.3500],
    'DOM JAIME CÂMARA': [-5.228459, -37.31464],
    'DOZE ANOS': [-5.1820, -37.3380],
    'ILHA DE SANTA LUZIA': [-5.1960, -37.3480],
    'LAGOA DO MATO': [-5.1800, -37.3350],
    'NOVA BETÂNIA': [-5.1760, -37.3400],
    'PAREDÕES': [-5.1900, -37.3420],
    'PLANALTO 13 DE MAIO': [-5.1990, -37.3490],
    'PRESIDENTE COSTA E SILVA': [-5.1980, -37.3520],
    'RINCÃO': [-5.2040, -37.3600],
    'SANTA DELMIRA': [-5.1990, -37.3570],
    'SANTA JÚLIA': [-5.1950, -37.3400],
    'SANTO ANTÔNIO': [-5.1663, -37.3433],
    'ALTO DO SUMARÉ': [-5.231820, -37.339779],
    'SÃO MANOEL': [-5.1950, -37.3550],
    'VINGT ROSADO': [-5.2000, -37.3620],
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await mountNeighborhoodData(setAffectedNeighborhoods, yearSelected, agravoSelected);
        localStorage.setItem('yearSelected', yearSelected);
        localStorage.setItem('agravoSelected', agravoSelected);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados dos bairros. Tente novamente.');
        setAffectedNeighborhoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [yearSelected, agravoSelected]) 

  const heatData = Array.isArray(affectedNeighborhoods) 
    ? affectedNeighborhoods
        .map((neighborhood: { nomeBairro: string | number; casosReportados: any; }) => {
          if (!neighborhood || !neighborhood.nomeBairro) return null;
          
          const coords = cordsNeighborhoods[neighborhood.nomeBairro];
          if (!coords) return null;

          const intensidade = neighborhood.casosReportados ?? 0;
          return [...coords, intensidade];
        })
        .filter(Boolean)
    : [];

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
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-lg">Carregando dados...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && heatData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg">Nenhum dado disponível para exibição</p>
          </div>
        )}

        {!loading && !error && heatData.length > 0 && (
          <HeatMap data={heatData} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default App;