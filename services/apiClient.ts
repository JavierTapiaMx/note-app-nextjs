import axios, { type AxiosRequestConfig } from "axios";

const getBaseURL = () => {
  // Browser environment
  if (typeof window !== "undefined") {
    return "/api";
  }

  // Server-side rendering - use environment variable or localhost
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (data?.errors && Array.isArray(data.errors)) {
        const validationMessage = data.errors
          .map((err: { path: string[]; message: string }) => err.message)
          .join(", ");
        throw new Error(validationMessage);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const statusMessages: Record<number, string> = {
        400: "Invalid request. Please check your input.",
        401: "You are not authorized to perform this action.",
        403: "You do not have permission to access this resource.",
        404: "The requested resource was not found.",
        500: "Server error. Please try again later."
      };

      throw new Error(statusMessages[status] || "An unexpected error occurred.");
    }

    if (error.request) {
      throw new Error("Network error. Please check your connection.");
    }

    throw new Error(error.message || "An unexpected error occurred.");
  }
);

class ApiClient<T> {
  constructor(public endpoint: string) {}

  getAll = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<T[]>(this.endpoint, config)
      .then((response) => response.data);
  };

  get = (id: number | string, config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}`, config)
      .then((response) => response.data);
  };

  post = (data: Partial<T>, config?: AxiosRequestConfig) => {
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
