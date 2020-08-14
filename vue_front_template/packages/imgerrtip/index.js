/*
 * @Description: 图片加载失败指令
 * @Date: 2020-06-28 17:41:31
 * @Author: LB
 */ 

 
const NO_FOUND_IMG = require('../images/no-found-img.png');
const NO_IMG = require('../images/no-img.png');

const handleImgError = function(el, binding, vnode) {
  if (el.src === null || el.src === '') {
    el.src = NO_IMG;
    return;
  }

  el.onerror = function() {
    el.src = NO_FOUND_IMG;
  };
};

const imgerr = {
  bind: handleImgError,
  update: handleImgError
};

export default imgerr;