/* 
  水平菜单导航栏
  @prop menus 菜单列表
  menus:[
    {
      cName:'导航名', 必填
      path:'路径',
      children:[]
    }
  ]
  
 */
<template>
  <ul class="menu">
    <li
      v-for="(menu,index) in menus"
      :id="menu.path"
      :key="index"
      @mouseenter="handelMenuEnter"
      @mouseleave="handleMenuLeave"
      @click="handleMenuClick"
    >
      <span class="text">{{ menu.cName }}</span>
      <span class="icon el-icon-arrow-down"></span>
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
  mounted() {},
  methods: {
    initMenuActive() {},

    /* 
    @function 鼠标移入，箭头图标翻转
    */
    handelMenuEnter(event) {
      let [, icon] = event.target.children;
      if (!icon) {
        return;
      }
      if (icon.classList.contains(rotateClassName)) {
        return;
      }
      icon.classList.add(rotateClassName);
    },

    /* 
    @function 鼠标移出，箭头图标恢复原样
    */
    handleMenuLeave(event) {
      let [, icon] = event.target.children;
      if (!icon) {
        return;
      }
      if (icon.classList.contains(rotateClassName)) {
        icon.classList.remove(rotateClassName);
      }
    },
    handleMenuClick(event) {
      let { target } = event;
    },
    removeLastActived() {
      let [last] = document.getElementsByName(menuActivedName);
      if (!last) {
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$actived-color: #3c80ff;

.menu {
  position: relative;
  display: flex;
  margin: 0;
  list-style: none;
  color: #fff;

  > li {
    display: block;
    width: 100px;
    text-align: center;
    line-height: 50px;
    border-bottom: 4px solid transparent;

    .text {
      margin-right: 10px;
    }

    .icon {
      transition: all 0.2s;
    }

    .icon-rotate {
      transform: rotate(180deg);
    }
  }

  .actived {
    font-weight: bold;
    border-bottom-color: $actived-color;
    color: $actived-color;
  }
}
</style>