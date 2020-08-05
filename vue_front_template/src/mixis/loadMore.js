/*
 * @Description: 封装加载更多数据，触发事件滑动到底部
 * @Date: 2020-06-10 12:05:49
 * @Author: LB
 */

// 标记定时器是否开启，避免重复调用
let time = null;

export default {
  data() {
    return {
      moreData: [],
      moreCurrentPage: 1,
      morePageSize: 40,
      isMoreLast: false,
      isMoreLoading: false
    };
  },
  computed: {
    isNoMoreData() {
      return this.moreData.length === 0;
    }
  },
  created() {
    this.getMoreData();
  },
  methods: {

    //  监听滚动事件
    onScrollToBottom(event) {
      console.log('onScrollToBottom');
      const {
        target: { scrollHeight, scrollTop, clientHeight }
      } = event;
      const bottomSpace = scrollHeight - scrollTop - clientHeight;
      if (bottomSpace === 0) {
        console.log('onScroll');
        this.isMoreLoading = true;
        if (time === null) {
          time = setTimeout(() => {
            this.loadMore();
            clearTimeout(time);
            time = null;
          }, 1000);
        }
      }
    },
    loadMore() {
      console.log('load more');
      this.moreCurrentPage = this.moreCurrentPage + 1;
      this.getMoreData();
    },
    getMoreData(params) {
      if (!this.moreGetFn) {
        return;
      }
      console.log('getMoreData');
      const requestParams = params || {};
      const { moreCurrentPage,
        morePageSize } = this;

      Object.assign(requestParams, {
        currentPage: moreCurrentPage,
        pageSize: morePageSize
      });

      this.moreGetFn(params)
        .then(res => {
          const { records, isLast } = res;

          this.isMoreLast = moreCurrentPage > 1 && isLast;
          if (moreCurrentPage === 1) {
            this.moreData = [];
          }

          this.moreData.push(...records);

        })
        .catch(err => {
          console.error(err);
          this.currentPage = this.currentPage - 1;
        }).finally(() => {
          this.isMoreLoading = false;
        });
    }

  }
};