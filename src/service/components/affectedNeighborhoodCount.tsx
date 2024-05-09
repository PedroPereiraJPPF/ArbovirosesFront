import getApiData from "../api/fetchApiData";

export async function affectedNeighborhoodCount(setCount: Function, yearSelected: string, agravo: string) {
    const apiData = await getApiData(`/notifications/count/neighborhood?year=${yearSelected}&agravo=${agravo}`);

    setCount(apiData.length);

    return apiData.length
} 