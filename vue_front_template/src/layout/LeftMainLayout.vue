<!--
 * @Description: 左右两栏布局
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 -->

<template>
  <div class="left-main-layout" :style="warpperStyle">
    <section class="section" :style="leftStyle">
      <slot name="left"></slot>
    </section>
    <main class="main" :style="mainStyle">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script scope>
export default {
  name: 'LeftMainLayout',
  props: {
    // 容器样式
    warpperStyle: {
      type: String,
      default: ''
    },

    // 左侧样式
    leftStyle: {
      type: String,
      default: ''
    },

    // 内容样式
    mainStyle: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.left-main-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: #ebebeb;
}

.section {
  margin-right: 5px;
  width: 200px;
  max-height: 100%;
  overflow-y: auto;
  background-color: #fff;
}

.main {
  flex: 1;
  background-color: #fff;
  overflow-x: hidden;
}
</style>