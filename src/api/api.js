import axios from "axios";
import { message } from "ant-design-vue";
const qs = require("qs");

const baseApiUrl = process.env.VUE_APP_BASE_URL;
const platformUrl = process.env.VUE_APP_PLATFORM_URL;

const service = axios.create({
  baseURL: baseApiUrl,
  timeout: 60000,
  headers: {
    authorization: "",
  },
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");


    if (token) {
      config.headers.authorization = token;
      return config;
    }

    // if (!token) {
    //   localStorage.removeItem("token");
    //   message.error("登录信息已过期，请重新登陆");
    //   setTimeout(() => {
    //     window.location.href = platformUrl
    //   }, 500);
    //   return false;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use((response) => {
  const { data } = response;
  const { code } = data;

  if (code === 20000) {
    return response
  }
  else {
    message.error(data.message)

    if (code === 20001) {
      localStorage.clear()
      setTimeout(() => {
        window.location.href = `${platformUrl}login`
      }, 500);
      return false;
    }

    return Promise.reject(response)
  }
}, (error) => {
  console.error(error)
  if (error.response && error.response.data.message.indexOf('authorization') > -1) {
    message.error('登录信息已过期，请重新登陆')
    setTimeout(() => {
      window.location.href = `${platformUrl}login`
    }, 500);
    return false;
  }
  return Promise.reject(error)
})

export function get(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      params: qs.stringify(data),
      method: "get",
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
        throw err;
      });
  });
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    service({
      url,
      data,
      method: "post",
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
        throw err;
      });
  });
}
