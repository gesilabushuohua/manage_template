/*
 * @Description: des
 * @Date: 2020-05-26 10:19:17
 * @Author: LB
 */
// 本文件主要用于生成摘要认证
const crypto = require('crypto');

/* 
@function 辅助函数，将字符串加密为 md5 字段
*/
const encryptMD5 = str => {
  const md5 = crypto.createHash('md5');
  md5.update(str);
  const md5Str = md5.digest('hex');
  return md5Str;
};

/* 
@function 生成摘要认证密码, 规则
@param url 使用摘要认证的 路径
@param str 后端传过来的认证码
*/
export const generateAuthentication = (url, str) => {
  if (!str) {
    return;
  }
  const tokens = str.split(',');
  let realmStr = '';
  let qopStr = '';
  let nonceStr = '';
  let opaqueStr = '';
  if (tokens.length > 0) {
    let pattern = /"(.*)"/;
    tokens.forEach(item => {
      if (item.indexOf('realm') > -1) {
        [, realmStr] = item.match(pattern);
      } else if (item.indexOf('qop') > -1) {
        [, qopStr] = item.match(pattern);
      } else if (item.indexOf('nonce') > -1) {
        [, nonceStr] = item.match(pattern);
      } else if (item.indexOf('opaque') > -1) {
        [, opaqueStr] = item.match(pattern);
      }
    });
  }
  const cnonceStr = Math.random()
    .toString(36)
    .substr(2);
  let codeAccount = encodeURIComponent(this.loginForm.account);

  const HA1 = encryptMD5(`${codeAccount}:${realmStr}:${this.loginForm.password}`);

  const HA2 = encryptMD5(`POST:${url}`);

  const ncStr = Math.floor(Math.random() * 100);

  const response = this.encryptMD5(`${HA1}:${nonceStr}:${ncStr}:${cnonceStr}:${qopStr}:${HA2}`);

  let authorization = `Digest username="${codeAccount}", realm="${realmStr}", nonce="${nonceStr}", uri="${url}/digestLogin", qop="${qopStr}", response="${response}", opaque="${opaqueStr}", nc="${ncStr}", cnonce="${cnonceStr}"`;

  return authorization;
};


// 下载文件
export const downloadBlockFile = (data, filename) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  

  // 自定义下载文件名（如exemple.txt）
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    Window.URL.revokeObjectURL();
  }, 3 * 1000);
};