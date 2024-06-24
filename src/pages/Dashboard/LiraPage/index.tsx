import { useState } from "react";
import LineChart from "../../../components/Charts/Lira/LineChart";
import LiraLineOptions from "../../../components/Charts/Lira/LineChart/options";
import AgravoSelector from "../../../components/Forms/SelectGroup/AgravoSelector";
import YearSelector from "../../../components/Forms/SelectGroup/YearSelector";
import DefaultLayout from "../../../layout/DefaultLayout";

const LiraPage: React.FC = () => {
    const liraLineOptions = LiraLineOptions();
    const [yearSelected, setYearSelected] = useState<string>((new Date().getFullYear()).toString())
    const [agravoSelected, setAgravoSelected] = useState<string>('dengue')

    return (
        <DefaultLayout>
            <div className="mt-4 grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
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
                <LineChart 
                    options={liraLineOptions}
                    series={
                        [
                            {
                                name: "teste",
                                data: [
                                    20, 30, 10, 11, 5, 25
                                ]
                            },
                            {
                                name: "teste 2",
                                data: [
                                    40, 50, 30, 20, 40, 80
                                ]
                            }
                        ]
                    }
                />
            </div>
        </DefaultLayout>
    );
}

export default LiraPage;