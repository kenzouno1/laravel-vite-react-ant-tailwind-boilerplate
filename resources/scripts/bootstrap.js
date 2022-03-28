// window._ = require('lodash');
import axios from 'axios';
import { message } from 'antd';

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  return response;
}, function (error) {

  const statusCode = error.response ? error.response.status : null;
  if (statusCode === 404) {
    message.error('Url này không tồn tại hoặc đã bị xoá')
  }

  if (statusCode === 401 && error.config.url != "/api/login") {
    localStorage.removeItem("access_token");
    message.error('Vui lòng đăng nhập để thực hiện thao tác này');
    location.href = "/login";
  }
  if (statusCode === 403) {
    message.error('Bạn không có quyền thực hiện thao tác này')
  }
  return Promise.reject(error);
});

window.axios = axios;

window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';
window.axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("access_token");
