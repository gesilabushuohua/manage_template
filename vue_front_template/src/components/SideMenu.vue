<template>
  <ul class="menu menus">
    <li v-for="(menu,index) in menus" :key="index">
      <p class="menu-item actived">
        <span>{{ menu.cName }}</span>
        <span class="icon el-icon-arrow-right"></span>
      </p>

      <ul class="menu sub-menu">
        <li
          v-for="(sub,subi) in menu.children"
          :key="index+'-'+subi"
          class="menu-item"
        >{{ sub.cName }}</li>
      </ul>
    </li>
  </ul>
</template>

<script>
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
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
$actived-color: #3c80ff;

.menu {
  padding: 0;
  list-style: none;

  .menu-item {
    position: relative;
    padding: 5px 10px;
    height: 40px;
    line-height: 40px;
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
  > .actived {
    border-right: 4px solid $actived-color !important;
    background: rgba($actived-color, 0.2);

    /* 菜单激活后，图标旋转，显示子菜单 */
    .icon {
      transform: rotate(90deg);
    }
    .sub-menu {
      display: block;
    }
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