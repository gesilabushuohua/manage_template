/*
 * @Description: 表格增删查改、页码更滑等相关操作函数
 * @Date: 2020-06-10 12:05:49
 * @Author: LB
 */

import { downloadBlockFile } from '@/utils/index.js';

const Formtitles = {
  add: '添加',
  edit: '编辑'
};

// 是否是最后一页
let isTableLast = false;

export default {
  data() {
    return {
      tableData: [],

      currentPage: 1,
      pageSize: 40,
      total: 40,
      submitType: 'add',

      baseFormVisible: false,

      // 获取表格数据中
      tableLoading: false,

      // 表单提交中
      submitting: false,

      // 数据删除中
      deling: false


    };
  },
  computed: {
    baseFormTitle() {
      return Formtitles[this.submitType];
    }
  },
  created() {
    this.getTableData();
  },
  methods: {

    // 显示添加弹窗
    showAddForm() {
      this.submitType = 'add';
      this.baseFormVisible = true;
    },

    // 显示编辑弹窗
    showEditForm(row) {
      this.baseForm = { ...row };
      this.baseForm.city = [this.baseForm.city];
      this.submitType = 'edit';
      this.baseFormVisible = true;
    },

    // 显示删除确认框
    showDelConfirm(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTableData(row);
      }).catch(() => {
        console.log('cancel');
      });
    },

    // 获取查询参数
    getQueryParams() {
      const {
        currentPage,
        pageSize
      } = this;
      const params = {
        currentPage,
        pageSize
      };
      const querysInstance = this.$refs.querys;
      if (querysInstance) {
        const queryParams = querysInstance.getQueryParams();
        Object.assign(params, queryParams);
      }
      return params;
    },

    // 初始化查询参数
    resetQueryParams() {
      if (!this.querys) {
        return;
      }

      this.querys.forEach(item => {
        item.value = '';
      });
    },


    resetBaseForm() {
      const form = this.$refs.baseForm;
      if (form && form.resetFields) {
        form.resetFields();
      }
      this.baseFormVisible = false;
    },

    // 更改页码
    handleCurrentChange(currentPage) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
      this.currentPage = currentPage;
      this.getTableData();
    },

    // 更改页数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (isTableLast) {
        this.currentPage = 1;
        this.$refs.table.bodyWrapper.scrollTop = 0;
      }
      this.getTableData();
    },

    getTableData() {
      if (!this.requestGetFn) {
        return;
      }
      this.tableLoading = true;
      const params = this.getQueryParams();

      this.requestGetFn(params)
        .then(res => {
          const { records, total, isLast } = res;
          isTableLast = isLast;
          this.tableData = records;
          this.total = total;
        })
        .catch(err => {
          console.error(err);
        }).finally(() => {
          this.tableLoading = false;
        });
    },

    // 校验表单
    verifyBaseForm() {
      this.$refs.baseForm.validate((valid) => {
        if (!valid) {
          console.log('error submit!!');
          return;
        }
        this.submitBaseForm();
      });
    },

    // 提交 添加、编辑 表单
    async submitBaseForm() {
      const requestFn = this.submitType === 'add' ? this.requestAddFn : this.requestEditFn;
      const params = { ...this.baseForm };
      const optSuccessFn = () => { this.baseFormVisible = false; };
      this.submitting = true;
      await this.crudData(params, requestFn, optSuccessFn);
      this.submitting = false;
    },

    async delTableData(row) {
      if (!this.requestDelFn) {
        return;
      }
      const params = row.id;
      const optSuccess = this.delChangePage;
      this.deling = true;
      await this.crudData(params, this.requestDelFn, optSuccess);
      this.deling = false;
    },

    delChangePage(del) {
      // eslint-disable-next-line
      const isArray = typeof del === 'array';
      const delNum = isArray ? del.length : 1;
      const pageNum = this.tableData.length;

      // 删除当前所有数据，页码减 1
      if (delNum === pageNum) {
        this.currentPage = this.currentPage - 1;
      }
    },

    // 增、改、删数据提交
    crudData(params, optFn, optSuccessFn) {
      optFn(params)
        .then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          optSuccessFn && optSuccessFn(params);
          this.getTableData();
        })
        .catch(err => {
          this.$message({
            message: '操作失败',
            type: 'error'
          });
          console.error(err);
        });
    },

    exportFile() {
      if (!this.exportFileFn) {
        return;
      }
      const params = {};
      this.exportFileFn(params).then(res => {
        const { isSuccessed, data } = res;
        if (isSuccessed && data !== null) {
          downloadBlockFile(data);
        }
      }).catch(err => {
        console.error('exportFile', err);
      });
    }

  }
};