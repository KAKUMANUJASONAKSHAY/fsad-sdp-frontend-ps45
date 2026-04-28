import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

const clearAuthSession = () => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('role')
  sessionStorage.removeItem('loggedInRole')
  sessionStorage.removeItem('loggedInAdmin')
  sessionStorage.removeItem('loggedInStudent')
  sessionStorage.removeItem('loggedInFaculty')
}

axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession()
      if (window.location.pathname !== '/') {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
