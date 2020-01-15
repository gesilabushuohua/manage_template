<template>
  <!--  <top-menu-layout>
    <template v-slot:nav>
      logo 标题 
      <div class="logo">
        <img src="@/assets/images/logo.jpeg" />
        <span class="title">SYSTEM MANAGE</span>
      </div>
      <horizontal-menu :menus="menus" />
    </template>
    <template v-slot:main>
      <h1>内容</h1>
    </template>
  </top-menu-layout>-->
  <side-menu-layout>
    <template v-slot:nav>
      <side-menu :menus="menus" />
    </template>
    <template v-slot:main>
      <h1>内容</h1>
    </template>
  </side-menu-layout>
</template>

<script>
import TopMenuLayout from '@/components/layout/TopMenuLayout';
import SideMenuLayout from '@/components/layout/SideMenuLayout';
import HorizontalMenu from '@/components/HorizontalMenu';
import SideMenu from '@/components/SideMenu';
export default {
  name: 'Layout',
  components: { TopMenuLayout, SideMenuLayout, HorizontalMenu, SideMenu },
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
              path: '/home'
            },
            {
              cName: '子菜单二',
              path: '/home'
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