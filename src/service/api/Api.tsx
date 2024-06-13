import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL ?? ""

const api = axios.create({
    baseURL: baseUrl
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response.status == 400) {
            return Promise.resolve(error.response)
        }

        if (error.response.status == 401 && !originalRequest.retry) {
            originalRequest.retry = true

            try {
                const refreshToken = localStorage.getItem("token");

                const response = await axios.post(`${baseUrl}/auth/refreshToken`, {
                    token: refreshToken
                })

                const accessToken = response.data.jwtToken

                localStorage.setItem('accessToken', accessToken)

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                }

                return axios(originalRequest)
            } catch (error) {
                localStorage.removeItem("token")
                localStorage.removeItem("accessToken")
                localStorage.removeItem("userName")
                window.location.href = 'auth/login';
            }
        }

        return Promise.reject(error)
    }
)

export default api;