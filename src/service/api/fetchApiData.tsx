async function fetchApi(uri: string)
{
    try {
        const baseApi = process.env.REACT_APP_API_URL ?? ""
        
        const apiFetch = await fetch(baseApi + uri)

        return apiFetch
    } catch (error) {
        throw error
    }
}

export default async function getApiData(uri: string)
{
  try {
    const response = await fetchApi(uri)
    const data = await response.json()
  
    return data.data
  } catch (error) {
    
  }
}