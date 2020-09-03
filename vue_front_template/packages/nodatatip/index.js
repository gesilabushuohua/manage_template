/*
 * @Description: 无数据指令
 * @Date: 2020-06-28 17:41:31
 * @Author: LB
 */
import Vue from 'vue';
import NoData from './NoData.vue';
const Tip = Vue.extend(NoData);

const appendTips = function(el, binding, vnode) {
  const tip = new Tip({
    el: document.createElement('div')
  });
 
  el.instance = tip;
  el.tip = tip.$el;
  el.instance.visible = binding.value;
  el.appendChild(el.tip);
 
};

const removeTips = function(el) {
  el.instance && el.instance.$destroy();
};


const toggleTips = function(el, binding, vnode) {
  el.instance.visible = binding.value;
};

const noDataTips = {
  bind: appendTips,
  update: toggleTips,
  unbind: removeTips
};

export default noDataTips;