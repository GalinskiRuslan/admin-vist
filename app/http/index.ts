import axios from "axios";

const $axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://vista-new-test2.gamma.kz/vista/api/v2"
      : "https://vista-new-test2.gamma.kz/vista/api/v2",
});

$axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
      return Promise.reject({
        errorText: "Ошибка авторизации",
        status: 401,
        method: error.config?.url,
      });
    } else if (error.response?.status === 400) {
      if (typeof error.response.data == "string") {
        return Promise.reject({
          errorText: error.response.data,
          status: 400,
          method: error.config?.url,
        });
      } else if (typeof error.response?.data == "object") {
        return Promise.reject({
          method: error.config?.url,
          errorText: error.response.data.message,
          status: 400,
        });
      } else {
        return Promise.reject({
          errorText: "Неизвестная ошибка",
          status: 400,
          method: error.config?.url,
        });
      }
    } else if (error.response?.status === 500) {
      return Promise.reject({
        errorText: "Ошибка на стороне Сервера",
        status: 500,
        method: error.config?.url,
      });
    } else {
      return Promise.reject({
        errorText: "Неизвестная ошибка",
        status: error.message,
        method: error.config?.url,
      });
    }
  }
);
$axios.interceptors.request.use((config: any) => {
  config.headers.Authorization = localStorage.getItem("token")
    ? `Bearer ${localStorage.getItem("token")}`
    : `Bearer ${localStorage.getItem("token_for_register")}`;
  return config;
});

export default $axios;
