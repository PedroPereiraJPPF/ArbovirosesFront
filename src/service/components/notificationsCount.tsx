import getApiData from "../api/fetchApiData";

export async function notificationsCountData(setCount: Function, yearSelected: string, agravo: string, bairro?: string) {
    const bairroParam = bairro ? `&bairro=${bairro}` : '';
    const apiData = await getApiData(`/notifications/count?year=${yearSelected}&agravo=${agravo}${bairroParam}`);

    setCount(apiData);
} 