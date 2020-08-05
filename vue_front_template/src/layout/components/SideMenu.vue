/* 
 二级左侧边菜单
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
  <ul class="menus">
    <li v-for="(menu,index) in menus" :key="index">
      <span
        :id="menu.path"
        class="menu-item"
        :data-is-leaf="!hasChildren(menu)"
        @click="handleMenuClick"
      >
        <span>{{ menu.cName }}</span>
        <span v-show="hasChildren(menu)" class="suffix-icon el-icon-arrow-right"></span>
      </span>

      <ul v-if="hasChildren(menu)" class="sub-menu">
        <li
          v-for="(sub,subi) in menu.children"
          :id="sub.path"
          :key="index+'-'+subi"
          class="menu-item"
          data-has-parent="true"
          @click="handleMenuClick"
        >{{ sub.cName }}</li>
      </ul>
    </li>
  </ul>
</template>

<script>
const menuClassName = 'menu-item';
const menuActivedClassName = 'actived';
const menuOpenClassName = 'open';

export default {
  name: 'SizeMenu',
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
    this.initMenu();
  },
  methods: {
    //  判断是否拥有子级
    hasChildren(menu) {
      return menu.children && menu.children.length > 0;
    },

    /* 
    @function 初始，根据路由路径，激活样式
    */
    initMenu() {
      const { path } = this.$route;
      const curMenuDom = document.getElementById(path);
      if (!curMenuDom) {
        return;
      }

      const {
        dataset: { hasParent }
      } = curMenuDom;

      //  存在父级,菜单在二级,展开一级，显示二级菜单
      if (hasParent) {
        const parent = curMenuDom.parentElement.parentElement;
        parent.classList.toggle(menuOpenClassName);
      }

      //  添加菜单激活样式
      this.toggleMenuActiveClass(curMenuDom);
    },

    /* 
    @function 点击菜单，添加|移出激活样式
    */
    handleMenuClick(event) {
      //  获取 menu-item dom
      let curMenuDom = event.target;
      if (!curMenuDom.classList.contains(menuClassName)) {
        curMenuDom = curMenuDom.parentElement;
      }
      const { path: lastPath } = this.$route;

      const {
        id: path,
        dataset: { hasParent, isLeaf }
      } = curMenuDom;

      //  跳转路径不存在，或当前路径与跳转路径相同，不做任何操作
      if (path === lastPath) {
        return;
      }

      //  将激活菜单，有二级菜单，先将二级菜单展开|关闭
      if (!hasParent && !isLeaf) {
        const parent = curMenuDom.parentElement;
        parent.classList.toggle(menuOpenClassName);
      } else if (path) {
        const lastMenuDom = document.getElementById(lastPath);

        //  移除旧菜单激活样式
        this.toggleMenuActiveClass(lastMenuDom);

        //  添加新菜单激活样式
        this.toggleMenuActiveClass(curMenuDom);
        this.$router.push(path);
      }
    },

    /*
    @function 添加|移除菜单激活样式
     */
    toggleMenuActiveClass(dom) {
      if (!dom) {
        return;
      }
      const { hasParent } = dom.dataset;

      //  拥有父级，操作父级样式
      if (hasParent) {
        const parent = dom.parentElement.previousElementSibling;
        parent.classList.toggle(menuActivedClassName);
      }

      //  操作当前菜单样式
      dom.classList.toggle(menuActivedClassName);
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/common_variable.scss';

.menus {
  margin: 10px 0;
  padding: 0;
  width: $horizontal-menu-width;
  list-style: none;

  /* 激活样式 */
  > li .actived {
    border-right: 4px solid $primary-color !important;
    background: rgba($primary-color, 0.2);
  }
}

/* 子菜单 */
.sub-menu {
  display: none;

  .menu-item {
    padding-left: 20px;
  }

  > .actived {
    color: $primary-color;
  }
}

/* 父级菜单 展开样式 */
.open {
  .suffix-icon {
    transform: rotate(90deg);
  }
  .sub-menu {
    display: block;
  }
}

/* 菜单项 */
.menu-item {
  display: block;
  position: relative;
  padding: 0 10px;
  height: $menu-item-height;
  line-height: $menu-item-height;
  cursor: pointer;
  border-right: 4px solid transparent;

  .suffix-icon {
    position: absolute;
    right: 20px;
    line-height: $menu-item-height;
    transition: all 0.4s;
  }
}

.menu-item:hover {
  background: rgba($primary-color, 0.2);
}
</style>