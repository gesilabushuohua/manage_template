/*
 * @Description: 表格增删查改、页码更滑等相关操作函数
 * @Date: 2020-06-10 12:05:49
 * @Author: LB
 */

const Formtitles = {
  add: '添加',
  edit: '编辑'
};

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 40,
      total: 40,
      type: 'add',

      formVisible: false,

      // 检索中
      searchLoading: false,

      // 表单提交中
      submitting: false,

      // 数据删除总
      delLoading: false
    };
  },
  computed: {
    formTitle() {
      return Formtitles[this.type];
    }
  },
  methods: {

    // 显示添加弹窗
    showAddForm() {
      this.type = 'add';
      this.formVisible = true;
    },

    // 显示编辑弹窗
    showEditForm() {
      this.type = 'edit';
      this.formVisible = true;
    },

    // 获取查询参数

    // 查询
    getData() { },

    // 添加
    addData() { },

    // 删除
    delData() { },

    // 编辑
    editData() { },

    // 更改页码
    handleCurrentChange(page) {

    },

    // 更改页数
    handleSizeChange(size) {

    }

  }
};