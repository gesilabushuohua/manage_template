<!--
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <top-main-layout top-style="margin-bottom:10px;height:30px;">
    <template v-slot:top>
      <div class="page-tag">页面标签</div>
    </template>
    <template v-slot:main>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="date" label="日期" width="150"/>
        <el-table-column prop="name" label="姓名" width="120"/>
        <el-table-column prop="province" label="省份" width="120"/>
        <el-table-column prop="city" label="市区" width="120"/>
        <el-table-column prop="address" label="地址"/>
        <el-table-column prop="zip" label="邮编" width="120"/>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

    </template>
  </top-main-layout>
  <!--  <left-main-layout >
     <template v-slot:left>
       <h1>哈哈哈哈哈哈</h1>
     </template>
     <template v-slot:main>
       <h2>溜溜溜溜</h2>
     </template>
  </left-main-layout>-->
</template>

<script>
import TopMainLayout from '@/layout/TopMainLayout';
import LeftMainLayout from '@/layout/LeftMainLayout';
export default {
  name: 'Home',
  components: { TopMainLayout, LeftMainLayout },
  props: {},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333
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
.marin10 {
  margin: 10px;
  border-radius: 10px;
}
</style>