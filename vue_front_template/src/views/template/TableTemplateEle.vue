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
import { ColumnPlus } from '@/assets/js/tableColumnPlus.js';

export default {
  name: 'TableTemplateEle',
  components: { ColumnPlus },
  props: {
    columns: {
      type: Array,
      required: true
    },
    getTableDataFn: {
      type: Function,
      default: true
    },
    addTableDataFn: {
      type: Function,
      default: null
    },
    editTableDataFn: {
      type: Function,
      default: null
    },
    delTableDataFn: {
      type: Function,
      default: null
    }
  },

  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 100
    };
  },
  computed: {},
  watch: {},
  created() {
    this.requsetGetTableData();
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
      if (!this.getTableDataFn) {
        return;
      }
      const { currentPage, pageSize } = this;
      const param = {
        currentPage,
        pageSize
      };
      console.log('getTableDataFn');
      this.getTableDataFn(param)
        .then(res => {
          const { code, data } = res;
          if (code === 0) {
            this.tableData = data;
          }
        })
        .catch(err => {});
    },
    requsetAddTableData() {
      if (!this.addTableDataFn) {
        return;
      }
      const param = {};
      this.addTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },
    requsetEditTableData() {
      if (!this.editTableDataFn) {
        return;
      }
      const param = {};
      this.editTableDataFn(param)
        .then(res => {})
        .catch(err => {});
    },
    requsetDelTableData() {
      if (!this.delTableDataFn) {
        return;
      }
      const param = {};
      this.delTableDataFn(param)
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
  height: 90%;
}

.footer {
  text-align: center;
}
</style>