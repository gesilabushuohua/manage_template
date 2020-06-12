/*
 * @Description: jsx 动态渲染  from-item
 * @Date: 2020-03-04 09:25:37
 * @Author: LB
 */

import Vue from 'vue';


export const formItemPlus = Vue.component('FormItemPlus', {
  name: 'FormItemPlus',
  props: {
    itemConfig: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const { itemConfig } = this;
    const directives = [
      {
        name: 'v-model',
        value: itemConfig.prop
      }
    ];
    return (
      <el-form-item {...itemConfig}>
        <el-input {...directives}></el-input>
      </el-form-item>
    );
  }
});
