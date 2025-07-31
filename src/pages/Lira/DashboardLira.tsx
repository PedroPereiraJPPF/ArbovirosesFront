import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import ChartLiraPorBairro from '../../components/Charts/ChartLiraPorBairro'; 

interface LiraData {
  bairro: string;
  indiceInfestacaoPredial: number;
  indiceBreteau: number;
}

const DashboardLira: React.FC = () => {
  const [liraData, setLiraData] = useState<LiraData[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/lira?ano=${year}`);
        setLiraData(
          response.data.map((item: any) => ({
            ...item,
            indiceInfestacaoPredial: item.indiceInfestPredial ?? item.indiceInfestacaoPredial,
          }))
        );
      } catch (err) {
        setError('Não foi possível carregar os dados do LIRA. Verifique se o backend está em execução e se os dados para o ano selecionado foram carregados.');
        console.error(err);
        setLiraData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard LIRA" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Evolução do LIRA por Bairro - {year}
          </h4>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Selecione o Ano
            </label>
            <input
              type="number"
              value={year}
              onChange={handleYearChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ChartLiraPorBairro data={liraData} />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DashboardLira;