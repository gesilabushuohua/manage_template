/*
 * @Description: 封装分页数据请求，页面切换
 * @Date: 2020-06-10 12:05:49
 * @Author: LB
 */

export default {
  data() {
    return {
      pageData: [],
      pcCurrentPage: 1,
      pcPageSize: 40,
      pcTotal: 40,
      pcLoading: false
    };
  },
  created() {
    this.getData();
  },
  methods: {

    // 更改页码
    handleCurrentChange(currentPage) {
      this.pcCurrentPage = currentPage;
      this.getData();
    },

    // 更改页数
    handleSizeChange(pageSize) {
      this.pcPageSize = pageSize;
      this.getData();
    },

    getData() {
      if (!this.pageChangeGetFn) {
        return;
      }
      const { pcCurrentPage,
        pcPageSize } = this;
      const params = {
        currentPage: pcCurrentPage,
        pageSize: pcPageSize
      };
      this.dataLoading = true;
      this.pageChangeGetFn(params)
        .then(res => {
          const { records, total } = res;
          this.pageData = records;
          this.pcTotal = total;
        })
        .catch(err => {
          console.error(err);
        }).finally(() => {
          this.dataLoading = false;
        });
    }

  }
};