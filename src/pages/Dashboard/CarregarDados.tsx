import { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { SuccessModal } from '../../components/Modals/SuccessModal';
import { useNavigate } from 'react-router-dom';
import api from '../../service/api/Api';
import gerarArquivoComErros from '../../components/NotificationsWithError/NotificationsWithError';
import * as XLSX from 'xlsx';

interface NotificationData {
    nuNotific: number;
    idAgravo: string;
    dtNotific: string;
    dtNasc: string;
    classiFin: string;
    csSexo: string;
    nmBairro: string;
    idBairro: number;
    evolucao: string;
    idade: number;
}

const CarregarDados: React.FC = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErrorMessage(null);
        setFile(null);
        setFileName(null);
        setProgress(0);
        setTotalRecords(0);
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

    function excelDateToJSDate(excelDate: any): string {
        if (!excelDate) return '';
        
        if (typeof excelDate === 'string') {
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(excelDate)) {
                return excelDate;
            }
            if (/^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
                const [year, month, day] = excelDate.split('-');
                return `${day}/${month}/${year}`;
            }
            return excelDate;
        }
        
        if (typeof excelDate === 'number') {
            const date = new Date((excelDate - 25569) * 86400 * 1000);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        
        if (excelDate instanceof Date) {
            const day = String(excelDate.getDate()).padStart(2, '0');
            const month = String(excelDate.getMonth() + 1).padStart(2, '0');
            const year = excelDate.getFullYear();
            return `${day}/${month}/${year}`;
        }
        
        return '';
    }

    async function processFile(file: File): Promise<NotificationData[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                    const processedData: NotificationData[] = jsonData.map((row: any) => ({
                        nuNotific: parseInt(row.NU_NOTIFIC || row.nu_notific || row.nuNotific) || 0,
                        idAgravo: row.ID_AGRAVO || row.id_agravo || row.idAgravo || '',
                        dtNotific: excelDateToJSDate(row.DT_NOTIFIC || row.dt_notific || row.dtNotific),
                        dtNasc: excelDateToJSDate(row.DT_NASC || row.dt_nasc || row.dtNasc),
                        classiFin: row.CLASSI_FIN || row.classi_fin || row.classiFin || '',
                        csSexo: row.CS_SEXO || row.cs_sexo || row.csSexo || '',
                        nmBairro: row.NM_BAIRRO || row.nm_bairro || row.nmBairro || '',
                        idBairro: parseInt(row.ID_BAIRRO || row.id_bairro || row.idBairro) || 0,
                        evolucao: row.EVOLUCAO || row.evolucao || '',
                        idade: parseInt(row.IDADE || row.idade) || 0,
                    }));

                    resolve(processedData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));

            if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    async function handleButtonClick() {
        if (!file) {
            alert("Por favor, selecione um arquivo primeiro.");
            return;
        }

        try {
            setLoadingData(true);
            setProgress(0);

            const allData = await processFile(file);
            setTotalRecords(allData.length);

            const batchSize = 100;
            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < allData.length; i += batchSize) {
                const batch = allData.slice(i, i + batchSize);

                try {
                    const response = await api.post('/saveNotifications', { notifications: batch });

                    if (response.status === 200) {
                        successCount += batch.length;
                    } else if (response.status === 401) {
                        navigate('/auth/register');
                        return;
                    } else {
                        errorCount += batch.length;
                    }
                } catch (error) {
                    console.error(`Erro ao enviar lote ${i / batchSize + 1}:`, error);
                    errorCount += batch.length;
                }

                const currentProgress = Math.round(((i + batch.length) / allData.length) * 100);
                setProgress(currentProgress);
                console.log(`Progresso: ${currentProgress}%`);
            }

            if (errorCount === 0) {
                setFile(null);
                setFileName(null);
                setOpenSuccessModal(true);
            } else {
                alert(`Processamento concluído com erros. Sucesso: ${successCount}, Erros: ${errorCount}`);
            }
        } catch (error) {
            console.error("Erro ao processar o arquivo:", error);
            alert("Ocorreu um erro ao processar o arquivo.");
        } finally {
            setLoadingData(false);
            setProgress(0);
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
                    {loadingData && totalRecords > 0 && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">Processando: {progress}%</p>
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
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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