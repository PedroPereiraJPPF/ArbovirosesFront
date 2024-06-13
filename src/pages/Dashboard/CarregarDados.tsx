import { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { SuccessModal } from '../../components/Modals/SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api/Api';

const CarregarDados: React.FC = () => {
    const authToken = localStorage.getItem('accessToken') ?? ""
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [openSucessModal, setOpenSuccessModal] = useState<boolean>(false);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) 
    {
        setErrorMessage(null)
        setFile(null)
        setFileName(null)
        const uploadedFile = event.target.files?.[0];

        if (uploadedFile) {
            if (uploadedFile.name.split('.').pop()?.toLowerCase() !== 'csv') {
                setErrorMessage('o arquivo precisa ser um csv')
                return
            }

            setFile(uploadedFile)
            setFileName(uploadedFile.name)
        }
    }

    function handleModalClose() 
    {
        setOpenSuccessModal(false)
    }

    async function handleButtonClick() {
        if (!file) {
            alert("Por favor, selecione um arquivo primeiro.");
            return;
          }
      
          const formData = new FormData();
          formData.append('csv_file', file);
      
          try {
            setLoadingData(true);

            const response = await api.post('/savecsvdata', formData)
      
            if (response.status == 200) {
              setFile(null)
              setFileName(null)
              setOpenSuccessModal(true)
            } else {
              setFile(null)
              setFileName(null)
              alert("Falha no envio do arquivo.");
            }
          } catch (error) {
            console.error("Erro ao enviar o arquivo:", error);
            alert("Ocorreu um erro ao enviar o arquivo.");
          } finally {
            setLoadingData(false);
          }
    }

    return (
        <DefaultLayout>
        <div>
            <div className='flex flex-col rounded-lg border border-dashed'>
                <div className='flex justify-center bg-indigo-500 text-white rounded-t-lg'>
                    Carregar arquivo CSV
                </div>
                <div className="flex justify-center border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Enviar arquivo</span>
                                <input 
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    />
                            </label>
                            <p className="pl-1">ou arraste e solte</p>
                        </div>
                        {
                            errorMessage && (
                                <p className='mt-2 text-lg leading-5 text-red-600'> {errorMessage}</p>
                            )
                        }
                        {   file && (
                                <p className="mt-2 text-lg leading-5 text-green-600 ">{fileName}</p>
                            )
                        }
                    </div>
                </div>
            </div>
           <div className='flex justify-center mt-2'>
            <button 
                className='flex justify-center items-center bg-indigo-500 enabled:hover:bg-indigo-800 disabled:opacity-75 rounded w-30 h-10 text-white cursor-pointer disabled:cursor-not-allowed'
                disabled={file == null || loadingData}
                onClick={handleButtonClick}
            >
                {
                    loadingData && (
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )
                }
                Enviar
            </button>
           </div>
        </div>
        <SuccessModal
            openModal={openSucessModal}
            handleModalClose={handleModalClose}
            message='Arquivo carregado com sucesso!'
            position='center'
        />
        </DefaultLayout>
    );
};

export default CarregarDados;