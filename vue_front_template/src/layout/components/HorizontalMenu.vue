/* 
  @function 二级水平菜单导航栏
  @prop menus 菜单列表
  menus:[
    {
      cName:'导航名', 必填
      path:'路径',
      children:[
         {
              cName: "子菜单一",
              path: "/subpath"
          }
      ]
    }
  ]
  
 */
<template>
  <ul class="menus" @click.capture="handleMenuClick">
    <li
      v-for="(menu,index) in menus"
      :id="menu.path"
      :key="index"
      class="menu-item"
      :data-path="menu.path"
      :data-is-leaf="!hasMenuChild(menu)"
    >
      <span>
        <span
          class="text"
          :data-path="menu.path"
          :data-is-leaf="!hasMenuChild(menu)"
        >{{ menu.cName }}</span>
        <span v-show="hasMenuChild(menu)" class="suffix-icon el-icon-arrow-down"></span>
      </span>

      <ul v-if="hasMenuChild(menu)" class="sub-menu">
        <li
          v-for="(subMenu,subi) in menu.children"
          :id="subMenu.path"
          :key="index+subi"
          class="text"
          data-is-leaf="true"
          data-has-parent="true"
          :data-path="subMenu.path"
        >{{ subMenu.cName }}</li>
      </ul>
    </li>
  </ul>
</template>

<script>
const menuActivedName = 'actived';

export default {
  name: 'HorizontalMenu',
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.initMenuActive();
  },
  methods: {
    /* 
    @function 判断 munu 是否有子菜单
    */

    hasMenuChild(menu) {
      return menu.children && menu.children.length > 0;
    },

    initMenuActive() {
      const { path } = this.$route;
      const menu = document.getElementById(path);
      this.toggleMenuActiveClass(menu);
    },

    /* 
    @function 为菜单添加样式，移除样式
    @param 添加样式 dom 节点
    */
    toggleMenuActiveClass(menu) {
      if (!menu) {
        return;
      }
      const { hasParent } = menu.dataset;
      if (hasParent) {
        const { parentElement } = menu.parentElement;
        parentElement.classList.toggle(menuActivedName);
      }
      menu.classList.toggle(menuActivedName);
    },

    handleMenuClick(event) {
      let { target } = event;
      const { path: lastPath } = this.$route;
      const { path, isLeaf } = target.dataset;
      if (!isLeaf || !path || path === lastPath) {
        return;
      }
      const menu = document.getElementById(path);
      const lastMenu = document.getElementById(lastPath);
      this.$router.push(path);

      //  移除之前菜单激活样式
      this.toggleMenuActiveClass(lastMenu);

      //  添加当前菜单激活样式
      this.toggleMenuActiveClass(menu);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/common_variable.scss';

$menu-padding-gap: 10px;
$sub-menu-width: 100px;

.menus {
  position: relative;
  display: flex;
  margin: 0;
  height: $veritical-menu-height;
  list-style: none;
}

.menu-item {
  position: relative;
  z-index: 999;
  display: block;
  padding: 0 $menu-padding-gap;
  width: $sub-menu-width;
  font-weight: normal;
  text-align: center;
  line-height: $menu-item-height;
  border-bottom: 4px solid transparent;

  > .text {
    margin-right: 10px;
  }

  .suffix-icon {
    position: absolute;
    right: -2px;
  }

  .sub-menu {
    display: none;
  /*   margin-left: -$menu-padding-gap; */
    width: $sub-menu-width;
    list-style: none;
    color: #000;
    background-color: #fff;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.4s;

    >li{
       padding: 0 $menu-padding-gap;
    }

    .actived {
      color: $primary-color;
    }
  }
}

.menu-item:hover {
  > .icon {
    transform: rotate(-180deg);
  }

  .sub-menu {
    display: block;

    > li:hover {
      cursor: pointer;
      color: $primary-color;
      background: rgba($primary-color, 0.2);
    }
  }
}

.actived{
  border-bottom-color: $primary-color;
  color: $primary-color;
}
</style>