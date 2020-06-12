<!--
 * @Description: 侧边布局首页
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <left-main-layout
    left-style="background-color:#333;color:#fff;"
    main-style="padding:8px 10px;"
  >
    <template v-slot:left>
      <side-menu :menus="menus" />
      <account account-style="left:25px;bottom:0px;color:#fff;" />
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </left-main-layout>
</template>

<script>
import LeftMainLayout from '@/layout/LeftMainLayout';
import SideMenu from '@/layout/components/SideMenu';
import Account from '@/layout/components/Account';

export default {
  name: 'Layout',
  components: {
    LeftMainLayout,
    SideMenu,
    Account
  },
  props: {},
  data() {
    return {
      menus: [
        {
          cName: '首页',
          path: '/side/home'
        },
        {
          cName: '系统管理',
          children: [
            {
              cName: '表格',
              path: '/side/table'
            },
            {
              cName: '表格',
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