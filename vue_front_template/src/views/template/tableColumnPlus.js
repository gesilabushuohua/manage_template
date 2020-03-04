/*
 * @Description: 封装 el-table-cloumn
 * @Date: 2020-03-02 11:48:19
 * @Author: LB
 */

import Vue from 'vue';

const updateKey = (k1, k2) => `${k1}-${k2}-${new Date()}`;


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
  name: 'img',
  render(h, context) {
    const cell = context.props.data;
    const { row } = cell;
    cell.src = row[cell.prop];
    console.log('img', row[cell.prop], cell)
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
    const { renderCells2, renderCells, render } = colConfig;
    const { } = colConfig;

    // 渲染 renderCells 元素 
    if (renderCells && renderCells.length > 0) {
      console.log(colConfig, updateKey(colConfig.prop, 'temp'));
      return (
        <el-table-column
          {...{ attrs: colConfig }}
          key={updateKey(colConfig.label, 'temp')}
          {...{
            scopedSlots: {
              default: scope => {
                return renderCells.map((cell, ci) => {
                  const item = cellType[cell.ele];
                  const copy = { ...cell };


                  if (copy.ele === 'btn' && cell.opt) {
                    if (cell.opt === 'edit') {
                      copy.optFn = this.editFn;
                    }

                    if (cell.opt === 'del') {
                      copy.optFn = this.delFn;
                    }
                  }
                  copy.row = scope.row;

                  console.log(copy)
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

    // 使用 vue createElement 参数 
    if (renderCells2) {

      return (
        <el-table-column
          {...{ attrs: colConfig }}
          {...{
            scopedSlots: {
              default: scope => {
                return renderCells2(h, scope.row);
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
  //  作废
 {
    label: '头像',
    render:(h,{row,index})=>{
      return (<img src={row.src}/>)
    }
  }


  {
    label: '抓怕',
    renderCells:[
      {
        ele: 'img',
        prop:'src'
      }
    ]
  }


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

   // 使用 createdElement
   {
    label: '操作',
    renderCells2: (h,row)=>{
      return h('img',{
        attrs:{
          src:row.src
        }
      })
    }
  }

*/