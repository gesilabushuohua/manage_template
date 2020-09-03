<!--
 * @Description: 基本表格操作
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <div class="horizontal-layout">
    <section class="section placeholder-w-200">
      <roll-content-layout
        @onScroll="onScrollToBottom"
        :is-bottom-loading="isMoreLoading"
        :is-bottom="isMoreLast"
        :is-no-data="isNoMoreData"
      >
        <template v-slot:content>
          <div class="list-card card" v-for="(item,index) in moreData" :key="index">
            <p>{{item.date}}</p>
            <p>
              <span>{{item.name}} ---</span>
              <span>{{item.province}}</span>
            </p>
          </div>
        </template>
      </roll-content-layout>
    </section>
    <main class="main"> 
      <div class="vertical-layout">
        <main class="main" v-no-data-tips="pageData.length === 0">
          <div class="blok-card card grid-card" v-for="(item,index) in pageData" :key="index">
            <span>{{item.name}}</span>
            <span>{{item.province}}</span>
            <span>{{item.city}}</span>
            <span class="photo" >
              <img src v-imgerr/>
            </span>
            <span class="date">{{item.date}}</span>
            <span class="address">{{item.address}}</span>
          </div>
        </main>
        <section class="section page-bottom">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pcCurrentPage"
            :page-sizes="[40, 100, 200, 300, 400]"
            :page-size="pcPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pcTotal"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script>
import RollContentLayout from '@/layout/RollContentLayout';
import pageChange from '@/mixis/pageChange.js';
import loadMore from '@/mixis/loadMore.js';
import { Get } from '@/api/tableRequest/services.js';

export default {
  name: 'Home',
  components: { RollContentLayout },
  mixins: [pageChange, loadMore],
  data() {
    return {

      // 非展示数据，冻结对象，减少数据监听
      pageChangeGetFn: Object.freeze(Get),
      moreGetFn: Object.freeze(Get)
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

.card {
  padding: 5px;
  border-radius: 5px;
  background-color: #eee;
}

.list-card {
  margin: 10px;
}

.blok-card {
  display: inline-block;
  margin: 10px 1%;
  width: 240px;
  height: 90px;
}

.grid-card {
  display: inline-grid;
  padding: 10px;
  grid-template-columns: repeat(3, 20%) 40%;
  grid-template-rows: repeat(3, 33.33%);

  > span {
    line-height: 30px;
    text-align: left;
  }

  .photo {
    grid-row-start: span 2;
  }

  .date {
    grid-column-start: span 3;
  }

  .address {
    grid-column-start: span 4;
  }
}
</style>