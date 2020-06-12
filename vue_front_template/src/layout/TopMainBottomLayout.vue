<!--
 * @Description: 上中下三栏布局
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 

<template>
  <div class="top-main-bottom-layout" :style="warpperStyle">
    <section class="section" :style="topStyle">
      <slot name="top"></slot>
    </section>
    <main class="main" :style="mainStyle">
      <slot name="main"></slot>
    </main>
    <main class="section bottom" :style="bottomStyle">
      <slot name="bottom"></slot>
    </main>
  </div>
</template>

<script scope>
export default {
  name: 'TopMainBottomLayout',
  props: {
    // 容器样式
    warpperStyle: {
      type: String,
      default: ''
    },

    // 顶侧样式
    topStyle: {
      type: String,
      default: ''
    },

    // 内容样式
    mainStyle: {
      type: String,
      default: ''
    },

    // 底部样式
    bottomStyle: {
      type: String,
      default: ''
    }
  }
};
</script>
 
 <style lang="scss" scoped>
.top-main-bottom-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.section {
  height: 35px;
  user-select: none;
  background-color: #fff;
}

.main {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
}

.bottom {
  padding-top: 5px;
  border-top: 1px solid #edebed;
  text-align: center;
}
</style>