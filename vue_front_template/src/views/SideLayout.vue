<!--
 * @Description: 侧边导航菜单实例
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <div class="horizontal-layout">
    <section class="left section side-menu">
      <div class="logo">
        <span class="system-title">MANAGE</span>
      </div>
      <side-menu :menus="menus" />
      <account account-style="left:25px;bottom:0px;color:#fff;" />
    </section>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import SideMenu from '@/layout/components/SideMenu.vue';
import Account from '@/layout/components/Account.vue';
import { sideMenus } from '@/config/menus.js';

export default {
  name: 'Layout',
  components: {
    SideMenu,
    Account
  },
  props: {},
  data() {
    return {
      menus: sideMenus
    };
  }
};
</script>
<style lang="scss" scoped>
.logo {
  margin-top: 10px;
  align-items: center;
  text-align: center;
}
</style>