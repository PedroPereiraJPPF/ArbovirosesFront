import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const CarregarLira: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [liraNumber, setLiraNumber] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setMessage(''); // Clear previous messages
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  };

  const handleLiraNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLiraNumber(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !year || !liraNumber) {
      setMessage('Por favor, selecione um arquivo, um ano e o número do LIRA.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ano', year.toString());
    formData.append('liraNumber', liraNumber.toString());

    try {
      const response = await axios.post('http://localhost:8080/api/lira/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Arquivo LIRA ${liraNumber}/${year} enviado com sucesso! ${response.data.length} registros processados.`);
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('lira-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Erro ao enviar o arquivo LIRA:', error);
      setMessage('Erro ao enviar o arquivo LIRA. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Carregar Dados LIRA" />
      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* Upload Form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Upload de Arquivo LIRA (.xlsx)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Envie os dados do Levantamento de Índice Rápido de Aedes aegypti
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ano <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={handleYearChange}
                    min="2020"
                    max="2030"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    placeholder="Ex: 2023"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Número do LIRA <span className="text-meta-1">*</span>
                  </label>
                  <select
                    value={liraNumber}
                    onChange={handleLiraNumberChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value={1}>LIRA 1 - 1º Trimestre</option>
                    <option value={2}>LIRA 2 - 2º Trimestre</option>
                    <option value={3}>LIRA 3 - 3º Trimestre</option>
                    <option value={4}>LIRA 4 - 4º Trimestre</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Arquivo LIRA (.xlsx) <span className="text-meta-1">*</span>
                </label>
                <input
                  id="lira-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Apenas arquivos .xlsx são aceitos. Máximo 10MB.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </div>
                ) : (
                  'Enviar Arquivo'
                )}
              </button>

              {message && (
                <div className={`mt-4 p-4 rounded-md ${
                  message.includes('sucesso') 
                    ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' 
                    : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50'
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </form>
          </div>

          {/* Information Card */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informações sobre o LIRA
              </h3>
            </div>
            <div className="p-6.5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-primary">1º</div>
                  <div className="text-sm text-center">Janeiro - Março</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Período seco</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-primary">2º</div>
                  <div className="text-sm text-center">Abril - Junho</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Transição</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-primary">3º</div>
                  <div className="text-sm text-center">Julho - Setembro</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Seco</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-primary">4º</div>
                  <div className="text-sm text-center">Outubro - Dezembro</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Chuvoso</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>Importante:</strong> Certifique-se de que o arquivo Excel está no formato correto, 
                  com as colunas na ordem esperada: Bairros, Total de Imóveis Inspecionados, 
                  Total de Imóveis Positivos, Índice de Infestação Predial, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CarregarLira;
