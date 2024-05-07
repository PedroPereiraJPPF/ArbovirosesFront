export async function fetchApi(uri: string)
{
    try {
        const baseApi = process.env.REACT_APP_API_URL ?? ""
        const apiFetch = await fetch(baseApi + uri)

        return apiFetch
    } catch (error) {
        throw error
    }
}