<template>
  <ul class="menu menus">
    <li v-for="(menu,index) in menus" :key="index">
      <p
        class="menu-item"
        :id="menu.path"
        :data-is-leaf="!hasChildren(menu)"
        @click="handleMenuClick"
      >
        <span>{{ menu.cName }}</span>
        <span v-show="hasChildren(menu)" class="icon el-icon-arrow-right"></span>
      </p>

      <ul v-if="hasChildren(menu)" class="menu sub-menu">
        <li
          v-for="(sub,subi) in menu.children"
          :id="sub.path"
          :key="index+'-'+subi"
          class="menu-item"
          data-is-leaf="true"
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
  computed: {},
  watch: {},
  created() {},
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
      const {
        dataset: { hasParent, isLeaf }
      } = curMenuDom;

      //  存在父级,菜单在二级,展开一级，显示二级菜单
      if (hasParent) {
        const parent = curMenuDom.parentElement.parentElement;
        parent.classList.toggle(menuOpenClassName);
      }
      
      //  添加菜单激活样式
      this.handleMenuActiveClass(curMenuDom);
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
        this.handleMenuActiveClass(lastMenuDom);

        //  添加新菜单激活样式
        this.handleMenuActiveClass(curMenuDom);
        this.$router.push(path);
      }
    },

    /*
    @function 添加|移除菜单激活样式
     */
    handleMenuActiveClass(dom) {
      if (!dom) {
        return;
      }
      const { hasParent, isLeaf } = dom.dataset;

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
$actived-color: #3c80ff;
$height: 40px;

.menu {
  padding: 0;
  list-style: none;

  .menu-item {
    position: relative;
    padding: 5px 10px;
    height: $height;
    line-height: $height;
    cursor: pointer;
    border-right: 4px solid transparent;
  }

  .menu-item:hover {
    background: rgba($actived-color, 0.2);
  }
}

.menus {
  margin: 20px 0;

  /* 点击菜单激活后 */
  > li > .actived {
    border-right: 4px solid $actived-color !important;
    background: rgba($actived-color, 0.2);
  }

  > li {
    .icon {
      position: absolute;
      top: 32%;
      right: 20px;
      transition: all 0.4s;
    }

    .sub-menu {
      display: none;
    }
  }

  .open {
    /* 打开菜单 */
    .icon {
      transform: rotate(90deg);
    }
    .sub-menu {
      display: block;
    }
  }
}

.sub-menu {
  .menu-item {
    padding-left: 20px;
  }

  > .actived {
    color: $actived-color;
  }
}
</style>