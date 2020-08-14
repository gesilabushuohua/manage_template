/*
 * @Description: 无数据指令
 * @Date: 2020-06-28 17:41:31
 * @Author: LB
 */

const tipClassName = 'no-data-msg';

const appendTips = function(el) {
  const tipDom = document.createElement('div');
  tipDom.classList.add(tipClassName);
  el.appendChild(tipDom);
};

const removeTips = function(el) {
  const tipDom = el.querySelector(`.${tipClassName}`);
  tipDom && el.reomveChild(tipDom);
};


const toggleTips = function(el, binding, vnode) {

  const tipDom = el.querySelector(`.${tipClassName}`);
  if (binding.value) {
    tipDom && (tipDom.style = 'display:block;');
  } else {
    tipDom && (tipDom.style = 'display:none');
  }

};

const noDataTips = {
  bind: appendTips,
  update: toggleTips,
  unbind: removeTips
};

export default noDataTips;