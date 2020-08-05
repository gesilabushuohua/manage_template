<!--
 * @Description: 内容滚动模块
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 

<template>
  <div class="roll-content-layout" :style="warpperStyle" @scroll.passive="onScroll">
    <div class="content" :style="contentStyle" v-no-data-tips="isNoData">
      <slot name="content"></slot>
      <div class="scroll-info" v-show="isBottomLoading"  >
        <span class="icon el-icon-loading"></span>
        <span>加载更多</span>
      </div>
      <div class="scroll-info" v-show="isBottom">
        <span>已到底部</span>
      </div>
    </div>
  </div>
</template>

<script scope>
export default {
  name: 'RollContentLayout',
  props: {

    // 容器样式
    warpperStyle: {
      type: String,
      default: ''
    },

    // 内容样式
    contentStyle: {
      type: String,
      default: ''
    },

    // 底部加载数据
    isBottomLoading: {
      type: Boolean,
      default: false
    },

    //  已加载至底部
    isBottom: {
      type: Boolean,
      default: false
    },

    // 没有数据
    isNoData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    onScroll(event) {
      this.$emit('onScroll', event);
    }
  }
};
</script>
 
 <style lang="scss" scoped>
@import '@/assets/css/common_variable.scss';

.roll-content-layout {
  height: 100%;
  overflow-y: auto;
}

.content{
  height: 100%;
}

// 滚动容器底部信息提示样式
.scroll-info {
  text-align: center;
  line-height: 40px;
  color: $normal-font-color;
  font-size: $normal-font-size;

  .icon {
    margin: 0 5px;
  }
}
</style>