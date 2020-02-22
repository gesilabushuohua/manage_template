<template>
  <!--  <top-menu-layout>
    <template v-slot:nav>
      <div class="logo">
        <img src="@/assets/images/logo.jpeg" />
        <span class="title">SYSTEM MANAGE</span>
      </div>
      <horizontal-menu :menus="menus" />
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </top-menu-layout>-->
  <side-menu-layout>
    <template v-slot:nav>
      <side-menu :menus="menus" />
     <!--  <account is-bottom /> -->
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </side-menu-layout>
</template>

<script>
import TopMenuLayout from '@/components/layout/TopMenuLayout';
import SideMenuLayout from '@/components/layout/SideMenuLayout';
import HorizontalMenu from '@/components/HorizontalMenu';
import SideMenu from '@/components/SideMenu';
/* import Account from '@/components/Account'; */
export default {
  name: 'Layout',
  components: {
    TopMenuLayout,
    SideMenuLayout,
    HorizontalMenu,
    SideMenu/* ,
    Account */
  },
  props: {},
  data() {
    return {
      menus: [
        {
          cName: '首页',
          path: '/home'
        },
        {
          cName: '系统管理',
          children: [
            {
              cName: '子菜单一',
              path: '/about'
            },
            {
              cName: '子菜单二',
              path: '/h2'
            }
          ]
        }
      ]
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
  align-items: center;

  > img {
    width: 40px;
    height: 40px;
  }

  .title {
    margin-left: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
}
</style>