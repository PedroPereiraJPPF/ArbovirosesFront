import { NeighborhoodInfo } from "../Entity/NeighborhoodInfo";
import { useNavigate } from "react-router-dom";

interface BaseTableProps {
  neighborhoodData: NeighborhoodInfo[]
}

const BaseTable: React.FC<BaseTableProps> = ({neighborhoodData}) => {
  const navigate = useNavigate();

  const irParaDashboardBairro = (nameBairro: String) => {
    navigate("/dashboard/bairro", { state: { bairro: nameBairro } });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Bairros
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Notificados
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Curados
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Obitos
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Ignorados
              </th>
            </tr>
          </thead>
          <tbody>
            {neighborhoodData.map((neighborhoodItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p 
                    onClick={() => irParaDashboardBairro(neighborhoodItem.nomeBairro)}
                    className="font-medium text-primary hover:underline hover:cursor-pointer dark:text-primarydark"
                  >
                    {neighborhoodItem.nomeBairro}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {neighborhoodItem.casosReportados}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {neighborhoodItem.curados}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {neighborhoodItem.mortePorAgravo}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {neighborhoodItem.igorados}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BaseTable;
