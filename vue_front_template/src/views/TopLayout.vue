<!--
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
--> 
<template>
  <top-main-layout
    warpper-style="background-color:#ebebeb;"
    top-style="padding:0 15px;background-color:#333;"
    main-style="padding:10px;height:calc(100% - 70px);"
  >
    <template v-slot:top>
      <div class="logo">
        <img src="@/assets/images/logo.jpeg" />
        <span class="title">SYSTEM MANAGE</span>
      </div>
      <horizontal-menu :menus="menus" />
      <account account-style="top:5px;right:30px;color:#fff;" />
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </top-main-layout>
</template>

<script>
import TopMainLayout from '@/layout/TopMainLayout';
import HorizontalMenu from '@/layout/components/HorizontalMenu';
import Account from '@/layout/components/Account';

export default {
  name: 'Layout',
  components: {
    TopMainLayout,
    HorizontalMenu,
    Account
  },
  props: {},
  data() {
    return {
      menus: [
        {
          cName: '首页',
          path: '/top/home'
        },
        {
          cName: '系统管理',
          children: [
            {
              cName: '表格',
              path: '/top/table'
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
  margin-right: 20px;
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