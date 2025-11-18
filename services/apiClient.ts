import axios, { type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

class ApiClient<T> {
  constructor(public endpoint: string) {}

  getAll = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<T>(this.endpoint, config)
      .then((response) => response.data);
  };

  get = (id: number | string, config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}`, config)
      .then((response) => response.data);
  };

  post = (data: T, config?: AxiosRequestConfig) => {
    return axiosInstance
      .post<T>(this.endpoint, data, config)
      .then((response) => response.data);
  };

  patch = (
    id: number | string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ) => {
    return axiosInstance
      .patch<T>(`${this.endpoint}/${id}`, data, config)
      .then((response) => response.data);
  };

  put = (id: number | string, data: T, config?: AxiosRequestConfig) => {
    return axiosInstance
      .put<T>(`${this.endpoint}/${id}`, data, config)
      .then((response) => response.data);
  };

  delete = (id: number | string, config?: AxiosRequestConfig) => {
    return axiosInstance
      .delete<T>(`${this.endpoint}/${id}`, config)
      .then((response) => response.data);
  };
}

export default ApiClient;
