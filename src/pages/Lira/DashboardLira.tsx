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
  const [liraNumber, setLiraNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  useEffect(() => {
    fetchData();
  }, [year, liraNumber, viewMode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (viewMode === 'single') {
        response = await axios.get(`http://localhost:8080/api/lira/filter?ano=${year}&liraNumber=${liraNumber}`);
      } else {
        response = await axios.get(`http://localhost:8080/api/lira?ano=${year}`);
      }
      setLiraData(
        response.data.map((item: any) => ({
          ...item,
          indiceInfestacaoPredial: item.indiceInfestPredial ?? item.indiceInfestacaoPredial,
        }))
      );
    } catch (err) {
      setError('Não foi possível carregar os dados do LIRA. Verifique se o backend está em execução e se os dados foram carregados.');
      console.error(err);
      setLiraData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  };

  const handleLiraNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLiraNumber(Number(event.target.value));
  };

  const handleViewModeChange = (mode: 'single' | 'all') => {
    setViewMode(mode);
  };

  const getChartTitle = () => {
    if (viewMode === 'single') {
      const trimesterNames = ['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'];
      return `LIRA ${liraNumber} - ${trimesterNames[liraNumber - 1]} de ${year}`;
    }
    return `Todos os LIRAs de ${year}`;
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Dashboard LIRA" />
      <div className="flex flex-col gap-6">
        {/* Filter Controls */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:justify-between xl:items-center">
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Análise dos Índices LIRA
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Visualize os dados do Levantamento de Índice Rápido de Aedes aegypti
              </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* View Mode Toggle */}
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => handleViewModeChange('single')}
                  className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                    viewMode === 'single'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  LIRA Individual
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange('all')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                    viewMode === 'all'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  Todos os LIRAs
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="w-full sm:w-48">
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                Ano
              </label>
              <input
                type="number"
                value={year}
                onChange={handleYearChange}
                min="2020"
                max="2030"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {viewMode === 'single' && (
              <div className="w-full sm:w-64">
                <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                  Número do LIRA
                </label>
                <select
                  value={liraNumber}
                  onChange={handleLiraNumberChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value={1}>LIRA 1 - 1º Trimestre</option>
                  <option value={2}>LIRA 2 - 2º Trimestre</option>
                  <option value={3}>LIRA 3 - 3º Trimestre</option>
                  <option value={4}>LIRA 4 - 4º Trimestre</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-black dark:text-white">
                  {getChartTitle()}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Índices de Infestação Predial e Bretau por Bairro
                </p>
              </div>
              
              {!loading && !error && liraData.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {liraData.length} bairros encontrados
                </div>
              )}
            </div>

            <div className="min-h-[400px] flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Carregando dados...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <button 
                      onClick={fetchData}
                      className="mt-2 px-4 py-2 text-sm bg-primary text-white rounded hover:bg-opacity-90"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              ) : liraData.length === 0 ? (
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Nenhum dado encontrado
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {viewMode === 'single' 
                        ? `Não há dados para o LIRA ${liraNumber} de ${year}`
                        : `Não há dados para o ano de ${year}`
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <ChartLiraPorBairro data={liraData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && !error && liraData.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 0L13.09 7.54L21 7.54L15.18 12.23L17.27 19.77L11 15.77L4.73 19.77L6.82 12.23L1 7.54L8.91 7.54L11 0Z"/>
                </svg>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {liraData.length}
                  </h4>
                  <span className="text-sm font-medium">Bairros Analisados</span>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.25 10.95L18.94 13.26C18.37 13.83 17.63 13.83 17.06 13.26L15.74 11.94L11 16.68L4.32 10L0 14.32V2C0 0.9 0.9 0 2 0H20C21.1 0 22 0.9 22 2V9.5L21.25 10.95Z"/>
                </svg>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {Math.max(...liraData.map(d => d.indiceInfestacaoPredial || 0)).toFixed(2)}%
                  </h4>
                  <span className="text-sm font-medium">Maior Índice Predial</span>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg className="fill-primary dark:fill-white" width="22" height="18" viewBox="0 0 22 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.18 13.576L13.136 7.62001L11 5.48401L7.18 9.30401L4.82 6.94401L2.684 9.08001L7.18 13.576ZM11 0.184006C5.456 0.184006 1 4.64001 1 10.184C1 15.728 5.456 20.184 11 20.184C16.544 20.184 21 15.728 21 10.184C21 4.64001 16.544 0.184006 11 0.184006Z"/>
                </svg>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {Math.max(...liraData.map(d => d.indiceBreteau || 0)).toFixed(2)}
                  </h4>
                  <span className="text-sm font-medium">Maior Índice Bretau</span>
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17C13.96 7.83 11.43 10.96 9.53 13.8C9.18 14.31 8.67 14.64 8.09 14.64H2C1.45 14.64 1 15.09 1 15.64C1 16.19 1.45 16.64 2 16.64H8.09C9.25 16.64 10.33 16.04 10.91 15.08L12.4 12.64L14.5 14.74L16 13.25L12.42 9.67L15.5 5.5L21 9Z"/>
                </svg>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {(liraData.reduce((sum, d) => sum + (d.indiceInfestacaoPredial || 0), 0) / liraData.length).toFixed(2)}%
                  </h4>
                  <span className="text-sm font-medium">Média Índice Predial</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default DashboardLira;