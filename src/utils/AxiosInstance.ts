import axios, { AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = "https://fakestoreapi.com";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    let errorMessage = "An error occurred";
    if (error.response) {
      errorMessage = error.response.data.message || error.response.statusText;
    } else if (error.request) {
      errorMessage = "No response from server";
    } else {
      errorMessage = error.message;
    }
    console.error("Error:", errorMessage);   
    return Promise.reject(error);
  }
);

export default axiosInstance;
