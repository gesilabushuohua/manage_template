import Vue from 'vue';

export const elementTableTemplate = Vue.component('element-table-template', {
  name: 'ElementTableTemplate',
  props: {
    //  表格数据结构
    dataStruct: {
      type: Object,
      required: true
    },

    //  表格内容列
    tableStruct: {
      type: Object,
      required: true
    },

    //  表格功能列
    tableFunColumns: {
      type: Array,
      required: true
    },

    //  表格功能列
    operateList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    tableData() {
      const obj = { ...this.dataStruct };
      return Array.from({ length: 5 }, () => {
        return obj;
      });
    }
  },
  render(h) {
    const FunColumns = () =>
      this.tableFunColumns.map(key => {
        switch (key) {
          case 'selection':
            return (
              <el-table-column type='selection' width='55'></el-table-column>
            );
          case 'index':
            return (
              <el-table-column type='index' width='50' label='编号'>
                222
              </el-table-column>
            );
          default:
            return '';
        }
      });

    const Operates = () =>
      this.operateList.map(key => {
        switch (key) {
          case 'add':
            return <el-button size='mini'>新增</el-button>;
          case 'edit':
            return <el-button size='mini'>编辑</el-button>;
          case 'delete':
            return <el-button size='mini'>删除</el-button>;
          default:
            return '';
        }
      });

    const OperateColumn = () => {
      if (this.operateList.length < 1) {
        return '';
      }
      return (
        <el-table-column label='操作'>
          <div slot-scope='scope'>
            <Operates></Operates>
          </div>
        </el-table-column>
      );
    };

    const { columns } = this.tableStruct;

    // 生成列函数
    const ColumnsTemplate = () =>
      columns.map(column => {
        if (column.type) {
          switch (column.type) {
            case 'switch':
              return (
                <el-table-column label={column.title}>
                  <div slot-scope='scope'>
                    <el-switch
                      v-model={column.pro}
                      active-color='#13ce66'
                      inactive-color='#ff4949'
                    ></el-switch>
                  </div>
                </el-table-column>
              );
            case 'image':
              return (
                <el-table-column label={column.title}>
                  <template slot-scope='scope'>
                    <img src='' />
                  </template>
                </el-table-column>
              );
            default:
              return '';
          }
        }

        return (
          <el-table-column
            prop={column.prop}
            label={column.title}
            type={column.type}
          ></el-table-column>
        );
      });

    return (
      <el-table data={this.tableData}>
        <FunColumns />
        <ColumnsTemplate />
        <OperateColumn />
      </el-table>
    );
  }
});
