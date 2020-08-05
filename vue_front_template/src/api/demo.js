/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */ 
import {
  postBodyRequestWithoutCredentials,
  getRequestWithoutCredentials
} from './request.js';

export const base = process.env.BASE_URL
  ? process.env.BASE_URL
  : '/mock/5e05b63bc50dc9001f37d09f';

export const login = params => {
  return postBodyRequestWithoutCredentials(`${base}/path`, params);
};

export const getCode = params => {
  return getRequestWithoutCredentials(`${base}/path/${params}`);
};


