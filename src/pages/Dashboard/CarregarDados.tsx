import { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { SuccessModal } from '../../components/Modals/SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api/Api';
import gerarArquivoComErros from '../../components/NotificationsWithError/NotificationsWithError';

const CarregarDados: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErrorMessage(null);
        setFile(null);
        setFileName(null);
        const uploadedFile = event.target.files?.[0];

        if (uploadedFile) {
            const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
            if (ext !== 'csv' && ext !== 'xlsx') {
                setErrorMessage('O arquivo precisa estar no formato .csv ou .xlsx');
                return;
            }

            setFile(uploadedFile);
            setFileName(uploadedFile.name);
        }
    }

    function handleModalClose() {
        setOpenSuccessModal(false);
    }

    async function handleButtonClick() {
        if (!file) {
            alert("Por favor, selecione um arquivo primeiro.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoadingData(true);
            const response = await api.post('/savecsvdata', formData);

            if (response.status === 200) {
                setFile(null);
                setFileName(null);
                setOpenSuccessModal(true);
            } else if (response.status === 401) {
                navigate('/auth/register');
            } else {
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
            <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Importar Notificações</h2>

                <div className="border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center">
                    <p className="text-gray-700 font-medium">Arraste e solte seu arquivo aqui ou</p>
                    <label htmlFor="file-upload" className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition">
                        Escolher arquivo
                        <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                        />
                    </label>
                    {fileName && (
                        <p className="mt-2 text-green-600 font-medium">Arquivo selecionado: {fileName}</p>
                    )}
                    {errorMessage && (
                        <div className="mt-3 flex items-center justify-center text-red-600">
                            
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <button
                        onClick={handleButtonClick}
                        disabled={!file || loadingData}
                        className="flex items-center justify-center bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {loadingData && (
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
                            </svg>
                        )}
                        Enviar Arquivo
                    </button>

                    <button
                        onClick={gerarArquivoComErros}
                        className="flex items-center justify-center bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                    >
                        Verificar Erros
                    </button>
                </div>
            </div>

            <SuccessModal
                openModal={openSuccessModal}
                handleModalClose={handleModalClose}
                message="Arquivo carregado com sucesso!"
                position="center"
            />
        </DefaultLayout>
    );
};

export default CarregarDados;