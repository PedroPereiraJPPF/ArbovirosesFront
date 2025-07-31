import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';

const CarregarLira: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !year) {
      setMessage('Por favor, selecione um arquivo e um ano.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('ano', year.toString());

    try {
      await axios.post('http://localhost:8080/api/lira/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Arquivo LIRA enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar o arquivo LIRA:', error);
      setMessage('Erro ao enviar o arquivo LIRA. Verifique o console para mais detalhes.');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Carregar Dados LIRA" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Upload de Arquivo LIRA (.xlsx)
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Ano
            </label>
            <input
              type="number"
              value={year}
              onChange={handleYearChange}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Arquivo LIRA (.xlsx)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx"
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            Enviar Arquivo
          </button>
          {message && <p className="mt-4 text-center">{message}</p>}
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CarregarLira;
