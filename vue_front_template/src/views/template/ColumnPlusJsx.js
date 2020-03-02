import Vue from 'vue';
import { TableColumn } from 'element-ui';

const renderCell = {
  slots: function (h, data) {
    // 接受传入的renderCell函数
    let renderCell = () => {
      return this.renderCell ? this.renderCell(data) : ''
    }

    return <div class="cell">{ renderCell(h, data) }</div>
  }
}

export const columnPlu = Vue.component('column-plu', {
  name: 'ColumnPlu',
  //  继承 el-table-column
  extends: TableColumn,
  props: {
    cellType: {
      type: String,
      validator: function (value) {
        let valid = ['text', 'input', 'slots'].includes(value)
        !valid && console.error(`columnPlus组件不适配 ${value} 类型`)
        return valid
      }
    },
    renderCell: {
      type: Function,
      default:null
    }
  },
  create(){
    if (renderCell[this.cellType]) {
      this.columnConfig.renderCell = renderCell[this.cellType].bind(this)
    }
  }
});
