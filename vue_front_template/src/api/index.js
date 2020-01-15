import {
  postBodyRequest,
  postBodyRequestWithoutCredentials,
  getRequestWithoutCredentials,
  putBodyRequest,
  deleteRequest,
  deleteFormRequest,
  getRequest,
  postRequest,
  getImgRequest,
  uploadFile
} from './request.js';

export const base = process.env.BASE_URL
  ? process.env.BASE_URL
  : 'http://XXX';

const api = {

  //  简单登录
  basicLogin: `${base}/basicLogin`,

  //  摘要登录
  digestLogin: `${base}/digestLogin`,

  //  获取验证码
  getCode: `${base}/getCode`
};


export const basicLogin = params => {
  return postBodyRequestWithoutCredentials(`${api.basicLogin}`, params);
};

export const digestLoginURL = api.digestLogin;

export const digestLogin = params => {
  return postBodyRequestWithoutCredentials(`${api.digestLogin}`, params);
};

export const getCode = account => {
  return getRequestWithoutCredentials(`${api.getCode}/${account}`);
};


