/*
 * @Description: 封装 el-table-cloumn
 * @Date: 2020-03-02 11:48:19
 * @Author: LB
 */
import Vue from 'vue';

//  暂时只支持 按钮、图片类型

const btn = {
  functional: true,
  name: 'btn',
  render(h, context) {
    const cell = context.props.data;
    return <el-button {...{ attrs: cell }}>{cell.text}</el-button>;
  }
};

const img = {
  functional: true,
  name: 'btn',
  render(h, context) {
    const cell = context.props.data;
    return <img {...{ attrs: cell }} />;
  }
};

const cellType = {
  btn,
  img
};

export const ColumnPlus = Vue.component('ColumnPlus', {
  name: 'ColumnPlus',
  props: {
    colConfig: {
      type: Object,
      required: true
    }
  },
  render(h) {
    const { colConfig } = this;
    const { renderCells } = colConfig;

    if (renderCells && renderCells.length > 0) {
      delete colConfig.renderCells;
      return (
        <el-table-column
          {...{ attrs: colConfig }}
          {...{
            scopedSlots: {
              default: scope => {
                console.log(scope);
                return renderCells.map(cell => {
                  const item = cellType[cell.ele];
                  if (cell.ele === 'img' && cell.prop) {
                    item.src = scope.row[cell.prop];
                  }
                  return <item data={cell} />;
                });
              }
            }
          }}
        ></el-table-column>
      );
    }

    return <el-table-column {...{ attrs: colConfig }} />;
  }
});