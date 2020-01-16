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
      class="menu"
      :data-path="menu.path"
      :data-is-leaf="!hasMenuChild(menu)"
    >
      <span class="text" :data-path="menu.path" :data-is-leaf="!hasMenuChild(menu)">{{ menu.cName }}</span>
      <span v-show="hasMenuChild(menu)" class="icon el-icon-arrow-down"></span>
      <ul v-if="hasMenuChild(menu)" class="subMenu">
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
const rotateClassName = 'icon-rotate';
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
  computed: {},
  watch: {},
  created() {},
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
      this.handleActivedMenu(menu);
    },
    /* 
    @function 为菜单添加样式，移除样式
    @param 添加样式 dom 节点
    */
    handleActivedMenu(menu) {
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
      this.handleActivedMenu(lastMenu);
      //  添加当前菜单激活样式
      this.handleActivedMenu(menu);
    }
  }
};
</script>
<style lang="scss" scoped>
$actived-color: #3c80ff;
$font-color: #fff;

.menus {
  position: relative;
  display: flex;
  margin: 0;
  list-style: none;
  font-size: 14px;
  color: $font-color;

  .menu {
    display: block;
    width: 100px;
    text-align: center;
    line-height: 50px;
    border-bottom: 4px solid transparent;

    > .text {
      margin-right: 10px;
    }

    > .icon {
      transition: all 0.4s;
    }

    .subMenu {
      display: none;
      margin-top: 5px;
      padding: 0;
      list-style: none;
      color: #000;
      background-color: #fff;
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.4s;

      .actived {
        color: $actived-color;
      }
    }
  }

  .menu:hover {
    > .icon {
      transform: rotate(-180deg);
    }

    .subMenu {
      display: block;

      > li:hover {
        cursor: pointer;
        background-color: regba($actived-color, 0.2);
      }
    }
  }

  .actived {
    font-weight: bold;
    border-bottom-color: $actived-color;
    color: $actived-color;
  }
}
</style>