<!--
 * @Description: 顶部导航菜单实例
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
    <div class="vertical-layout">
    <section class="top section top-menu">
        <div class="logo">
        <img src="@/assets/images/logo.jpeg">
        <span class="system-title">SYSTEM MANAGE</span>
      </div>
       <horizontal-menu :menus="menus" />
      <account account-style="top:5px;right:30px;color:#fff;" />
    </section>
    <main class="main">
        <router-view />
    </main>
  </div>

</template>

<script>

import HorizontalMenu from '@/layout/components/HorizontalMenu';
import Account from '@/layout/components/Account';
import { topMenus } from '@/config/menus.js';

export default {
  name: 'Layout',
  components: {
    HorizontalMenu,
    Account
  },
  props: {},
  data() {
    return {
      menus: topMenus
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.logo {
  display: flex;
  margin-right: 20px;
  align-items: center;

  > img {
    width: 40px;
    height: 40px;
  }

  .system-title {
    margin-left: 10px;
  }
}
</style>