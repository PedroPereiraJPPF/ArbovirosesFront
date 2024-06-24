import LineChart from "../../../components/Charts/Lira/LineChart";
import LiraLineOptions from "../../../components/Charts/Lira/LineChart/options";
import DefaultLayout from "../../../layout/DefaultLayout";

const liraLineOptions = LiraLineOptions();

const LiraPage: React.FC = () => {
    return (
        <DefaultLayout>
            <div className="mt-4 grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
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