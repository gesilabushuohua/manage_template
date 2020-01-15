/* 
  顶部菜单，中间内容布局
  只设置布局样式，不涉及任何数据及用户操作
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
  height: 100%;
  background-color: #ebebeb;
}

$nav-height:55px;
$main-padding:10px;
$main-margin:10px;

nav {
  display: flex;
  height: $nav-height;
  padding: 0 20px;
  background-color: #01032d;
  color: #fff;
  user-select: none;
}

main {
  margin: $main-margin;
  padding: $main-padding;
  height: calc(100% - 95px);
  background-color: #fff;
}
</style>