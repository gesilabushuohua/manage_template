import axios from 'axios';

let token = '';

let myIntercepter = axios.interceptors.request.use(
  function(config) {
    token = token ? token : sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let axiosWithoutToken = axios.create();
axiosWithoutToken.interceptors.request.eject(myIntercepter);

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${url}`,
    data: params,
    transformRequest: [
      function(data) {
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
