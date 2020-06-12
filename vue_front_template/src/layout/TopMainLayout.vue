<!--
 * @Description: 上下两栏布局
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 

<template>
  <div class="top-main-layout" :style="warpperStyle">
    <section class="section" :style="topStyle">
      <slot name="top"></slot>
    </section>
    <main class="main" :style="mainStyle">
      <slot name="main"></slot>
    </main>
  </div>
</template>

<script scope>
export default {
  name: 'TopMainLayout',
  props: {
    // 容器样式
    warpperStyle: {
      type: String,
      default: ''
    },

    // 左侧样式
    topStyle: {
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
.top-main-layout {
  height: 100%;
  overflow: hidden;
}

.section {
  display: flex;
  margin-bottom: 5px;
  height: 50px;
  user-select: none;
  background-color:#fff;
}

.main {
  background-color:#fff;
}
</style>