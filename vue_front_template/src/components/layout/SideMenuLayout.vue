<!--
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 -->
/* 
 侧边菜单布局
 */
<template>
  <div class="wrapper">
    <nav>
      <slot name="nav"></slot>
    </nav>
    <main>
      <slot name="main"></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 100%;
  background-color: #ebebeb;
}

nav {
  position: relative;
  width: 200px;
  max-height: 100%;
  background-color: #fff;
}

main {
  margin: 10px;
  height: calc(100% - 60px);
  flex: 1;
  border-radius: 6px;
  background-color: #fff;
}
</style>