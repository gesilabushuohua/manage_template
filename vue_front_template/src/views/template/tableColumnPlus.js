/*
 * @Description: 封装 el-table-cloumn
 * @Date: 2020-03-02 11:48:19
 * @Author: LB
 */

import Vue from 'vue';




//  作废，UI 组件 class 易作废
const btn = {
  functional: true,
  name: 'btn',
  render(h, context) {
    const cell = context.props.data;
    const { addClass, row, optFn } = cell;
    // 避免组件样式被声明样式覆盖，重新定义赋值
    const reClass = addClass ? addClass : '';
    delete cell.addClass;

    if (cell.optFn) {
      delete cell.optFn;
      delete cell.row;

      return <el-button {...{ attrs: cell }} class={reClass} onClick={() => optFn(row)} >{cell.text}</el-button>;
    }
    return <el-button {...{ attrs: cell }} class={reClass} >{cell.text}</el-button>;
  }

};

const img = {
  functional: true,
  name: 'btn',
  render(h, context) {
    const cell = context.props.data;
    console.log(context);
    return <img {...{ attrs: cell }} />;
  }
};

const cellType = {
  btn,
  img
};



export const ColumnPlus = Vue.component('ColumnPlus', {
  name: 'ColumnPlus',
  /* 
    目前，只支持 编辑，删除功能
  */
  props: {
    colConfig: {
      type: Object,
      required: true
    },
    editFn: {
      type: Function,
      default: null
    },
    delFn: {
      type: Function,
      default: null
    }
  },
  render(h) {
    const { colConfig } = this;
    const { renderCells } = colConfig;
    const { render } = colConfig;

    //  作废
    // 渲染 renderCells 元素 
    if (renderCells && renderCells.length > 0) {
      delete colConfig.renderCells;
      const that = this;
      return (
        <el-table-column
          {...{ attrs: colConfig }}
          {...{
            scopedSlots: {
              default: scope => {
                return renderCells.map(cell => {
                  const item = cellType[cell.ele];
                  const copy = { ...cell };
                  if (copy.ele === 'img' && copy.prop) {
                    copy.src = scope.row[copy.prop];
                  }

                  if (copy.ele === 'btn' && cell.opt) {
                    if (cell.opt === 'edit') {
                      copy.optFn = this.editFn;
                    }

                    if (cell.opt === 'del') {
                      copy.optFn = this.delFn;
                    }
                  }
                  copy.row = scope.row;
                  return <item data={copy} />;
                });
              }
            }
          }}
        ></el-table-column>
      );
    }

    //  渲染 render 函数,暂时无法解决 多按钮绑定事件
    if (render) {
      delete colConfig.renderCells;
      const item = {
        functional: true,
        name: 'item',
        render: (h, context) => {
          const { row, $index: index } = context.props.data;
          return render(h, { row, index });
        }
      };


      return (
        <el-table-column
          {...{ attrs: colConfig }}
          {...{
            scopedSlots: {
              default: scope => {
                return <item data={scope} />;
              }
            }
          }}
        ></el-table-column>
      );
    }

    return <el-table-column {...{ attrs: colConfig }} />;
  }
});


/*
Dome 事例
render，renderCells 只支持其中一种

 {
    label: '头像',
    render:(h,{row,index})=>{
      return (<img src={row.src}/>)
    }
  }

  //  作废
  {
    label: '抓怕',
    renderCells:[
      {
        ele: 'img',
        prop:'src'
      }
    ]
  }

  //  作废
  {
    label: '操作',
    renderCells: [
      {
        ele: 'btn',
        type: 'text',
        disabled: true,
        text: '编辑'
      },
      {
        ele: 'btn',
        icon: 'el-icon-edit',
        text: '删除'
      }
    ]
  }


*/