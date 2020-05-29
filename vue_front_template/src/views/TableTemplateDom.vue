<!--
 * @Description: XXX门禁
 * @Date: 2020-03-02 10:55:31
 * @Author: LB
 -->
 
<template>
  <div class="wrapper">
    <p class="table-title">XXXX</p>
    <TableTemplateEle v-bind="tableConfig" />
  </div>
</template>

<script>
import TableTemplateEle from '@/views/template/TableTemplateEle.vue';

// 表格增删查改函数
const getTableDataFn = () =>
  new Promise(resolve => {
    resolve({
      code: 0,
      message: '成功',
      data: [
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
      ]
    });
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
    label: '抓拍',
    renderCells: [
      {
        ele: 'img',
        prop: 'src'
      }
    ]
  },
  {
    label: 'XX地址',
    prop: 'date'
  },
  {
    label: 'XX地址',
    prop: 'name'
  },
  {
    label: '名称',
    prop: 'name'
  },
  {
    label: '编码',
    prop: 'address'
  },
  {
    label: '单位',
    prop: 'address'
  },
  {
    label: '状态',
    prop: 'name'
  },
  {
    label: '操作',
    renderCells: [
      {
        ele: 'btn',
        text: '编辑',
        opt: 'edit',
        size: 'mini'
      }
    ]
  }
];

export default {
  name: 'HaiKang',
  components: { TableTemplateEle },
  data() {
    return {
      tableConfig: {
        columns,
        getTableDataFn,
        addTableDataFn
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.main {
  height: 80%;
}

.footer {
  text-align: center;
}
</style>