<!--
 * @Description: 表格模板
 * @Date: 2020-03-02 10:55:31
 * @Author: LB
 -->
<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%">
      <column-plus v-for="(col,index) in columns" :key="index" :col-config="col" />
    </el-table>
  </div>
</template>

<script>
import { ColumnPlus } from './tableColumnPlus.js';
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
        src: 'aaaaa'
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
];
export default {
  name: 'TableTemPlateEle',
  components: { ColumnPlus },
  props: {},
  data() {
    return {
      columns,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
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
}
</style>