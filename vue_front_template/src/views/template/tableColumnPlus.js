/*
 * @Description: 封装 el-table-cloumn
 * @Date: 2020-03-02 11:48:19
 * @Author: LB
 */
import Vue from 'vue';


export const ColumnPlus = Vue.component('ColumnPlus', {
  name: 'ColumnPlus',
  props: {
    colConfig: {
      type: Object,
      required: true
    }
  },
  render() {
    const { colConfig } = this;
    const { renderCell } = colConfig;

    if (typeof renderCell == 'function') {
      console.log('has renderCell function', colConfig);
      delete colConfig.renderCell;
      const Cell = renderCell();
      
      return (<el-table-column  {...{ attrs: colConfig }} >
        <Cell />
      </el-table-column>);
    }

    return (<el-table-column  {...{ attrs: colConfig }} />);
  }
});