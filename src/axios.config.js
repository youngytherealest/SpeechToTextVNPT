import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://10.91.13.112:8000',
});

axiosInstance.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => error?.response?.data ?? error ?? "Lỗi không xác định"
);

export default axiosInstance;
