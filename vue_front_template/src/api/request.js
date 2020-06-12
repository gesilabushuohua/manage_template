import axios from 'axios';
import router from '@/router/index.js';
import { Notification, MessageBox } from 'element-ui';

let token = '';

//  axios 添加 request 拦截，添加 token 实例
let myIntercepter = axios.interceptors.request.use(
  function (config) {
    token = token ? token : sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 创建不需发送 request 拦截实例
let axiosWithoutToken = axios.create();
axiosWithoutToken.interceptors.request.eject(myIntercepter);


//  axios 添加 response 拦截，处理请求异常 
axios.interceptors.response.use(
  response => {
    const code = response.status;
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      });
      return Promise.reject('error');
    }
    const resCode = response.data.code;
    const isSccessed = resCode === 0;
    if (!isSccessed) {
      const { message } = response.data;
      Notification.error({
        title: message,
        duration: 5000
      });
    }
    return { isSccessed, data: response.data.data };

  },
  error => {
    let code = 0;
    try {
      code = error.response.data.status;
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        });
        return Promise.reject(error);
      }
    }
    if (code) {
      if (code === 401) {
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          router.push({ path: '/login' });
        });
      } else if (code === 403) {
        router.push({ path: '/401' });
      } else {
        const errorMsg = error.response.data.message;
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          });
        }
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      });
    }
    return Promise.reject(error);
  }
);

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${url}`,
    data: params,
    transformRequest: [
      function (data) {
        let ret = '';
        for (const it in data) {
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`;
        }
        return ret;
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const postBodyRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
};

export const postBodyRequestWithoutCredentials = (url, params) => {
  return axiosWithoutToken({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
};

export const putBodyRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
};

export const putRequest = url => {
  return axios({
    method: 'put',
    url: `${url}`
  });
};

export const deleteBodyRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${url}`,
    data: params,

    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
};

export const deleteFormRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  });
};

export const deleteRequest = url => {
  return axios({
    method: 'delete',
    url: `${url}`
  });
};

export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${url}`,
    params
  });
};

export const patchBodyRequest = (url, params) => {
  return axios({
    method: 'patch',
    url: `${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
};

export const getRequestWithoutCredentials = url => {
  return axiosWithoutToken({
    method: 'get',
    url: `${url}`
  });
};

// 导出文件请求，服务端文件流接收类型转为 blob，防止文档乱码
export const exportFile = (url, params) => {
  return axios({
    method: 'post',
    url,
    data: params,
    responseType: 'blob'
  });
};

export const uploadFile = (url, data) => {
  return axios({
    method: 'post',
    url,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getImgRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${url}`,
    responseType: 'arraybuffer',
    params
  });
};
