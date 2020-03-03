<!--
 * @Description: 表格模板
 * @Date: 2020-03-02 10:55:31
 * @Author: LB
 -->
<template>
  <div class="wrapper">
    <div class="main">
      <el-table :data="tableData">
        <column-plus
          v-for="(col,index) in columns"
          :key="index"
          :col-config="col"
          :edit-fn="handleEditTableData"
          :del-fn="handleDelTableData"
        />
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[20, 40, 60]"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper, sizes"
        @size-change="changePageSize"
        @current-change="changeCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { ColumnPlus } from './tableColumnPlus.js';
import { tableMixin } from '@/mixis/tableMixin.js';

// 表格增删查改函数
const getTableDataFn = () =>
  new Promise(resolve => {
    resolve();
  });
const addTableDataFn = () =>
  new Promise(resolve => {
    resolve();
  });
const editTableDataFn = () =>
  new Promise(resolve => {
    resolve();
  });
const delTableDataFn = () =>
  new Promise(resolve => {
    resolve();
  });

//  表格行列设置
const columns = [
  {
    label: '时间',
    prop: 'date'
  },
  {
    label: '姓名',
    prop: 'name'
  },
  {
    label: '头像',
    renderCells: [
      {
        ele: 'img',
        prop: 'src'
      }
    ]
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '操作',
    renderCells: [
      {
        ele: 'btn',
        type: 'text',
        opt: 'edit',
        addClass: 'add',
        disabled: false,
        text: '编辑'
      },
      {
        ele: 'btn',
        icon: 'el-icon-edit',
        text: '删除',
        opt: 'del'
      }
    ]
  }
];

export default {
  name: 'TableTemPlateEle',
  components: { ColumnPlus },
  props: {},
  mixins: [
    //  封装表格常用函数
    tableMixin
  ],
  data() {
    return {
      columns,
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 100
    };
  },
  computed: {},
  watch: {},
  created() {
    this.tableData = [
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        src: 'aaa'
      },
      {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        src:
          'http://img4.imgtn.bdimg.com/it/u=1223780803,2412931209&fm=26&gp=0.jpg'
      },
      {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        src: 'aaa'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        src: 'aaa'
      }
    ];
  },
  mounted() {},
  methods: {
    changePageSize(size) {
      console.log('changePageSize');
      this.pageSize = size;
      this.requsetGetTableData();
    },
    changeCurrentPage(cur) {
      console.log('changeCurrentPage');
      this.currentPage = cur;
      this.requsetGetTableData();
    },
    requsetGetTableData() {
      if (!getTableDataFn) {
        return;
      }
      const { currentPage, pageSize } = this;
      const param = {
        currentPage,
        pageSize
      };
      console.log('getTableDataFn');
      getTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },
    requsetAddTableData() {
      if (!addTableDataFn) {
        return;
      }
      const param = {};
      addTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },
    requsetEditTableData() {
      if (!editTableDataFn) {
        return;
      }
      const param = {};
      editTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },
    requsetDelTableData() {
      if (!delTableDataFn) {
        return;
      }
      const param = {};
      delTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },

    handleEditTableData(row) {
      console.log('handleEditTableData', row);
    },
    handleDelTableData(row) {
      console.log('handleDelTableData', row);
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 80vh;
}

.footer {
  text-align: center;
}
</style>