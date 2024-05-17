import getApiData from "../api/fetchApiData";

export async function notificationsCountData(setCount: Function, yearSelected: string, agravo: string) {
    const apiData = await getApiData(`/notifications/count?year=${yearSelected}&agravo=${agravo}`);

    setCount(apiData);
} 