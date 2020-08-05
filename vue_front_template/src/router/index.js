/*
 * @Description: des
 * @Date: 2020-01-03 17:45:59
 * @Author: LB
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const SideLayout = () => import('@/views/SideLayout.vue');
const TopLayout = () => import('@/views/TopLayout.vue');
const About = () => import('@/views/About.vue');
const BaseTable = () => import('@/views/BaseTable.vue');
const BaseRollDetail = () => import('@/views/BaseRollDetail.vue');
const BaseTree = () => import('@/views/BaseTree.vue');
const BaseMap = () => import('@/views/BaseMap.vue');

const LoginForm = () => import('@/views/form/LoginForm.vue');
const ModifyPwdForm = () => import('@/views/form/ModifyPwdForm.vue');
const BasicForm = () => import('@/views/form/BasicForm.vue');

const Page404 = () => import('@/views/404.vue');



Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/side',
    name: 'side',
    component: SideLayout,
    children: [
      {
        path: 'loginForm',
        name: 'sideLoginForm',
        component: LoginForm
      },
      {
        path: 'modifyPwdForm',
        name: 'sideModifyPwdForm',
        component: ModifyPwdForm
      },
      {
        path: 'baseForm',
        name: 'sideBasicForm',
        component: BasicForm
      },
      {
        path: 'table',
        name: 'sidetable',
        component: BaseTable
      },
      {
        path: 'rollDetail',
        name: 'sideBaseRollDetail',
        component: BaseRollDetail
      },
      {
        path: 'tree',
        name: 'sideTree',
        component: BaseTree
      },
      {
        path: 'map',
        name: 'sideMap',
        component: BaseMap
      },
      {
        path: '*',
        name: 'side404',
        component: Page404
      }
    ]
  },
  {
    path: '/top',
    name: 'top',
    component: TopLayout,
    children: [
      {
        path: 'loginForm',
        name: 'topLoginForm',
        component: LoginForm
      },
      {
        path: 'modifyPwdForm',
        name: 'topModifyPwdForm',
        component: ModifyPwdForm
      },
      {
        path: 'baseForm',
        name: 'topBasicForm',
        component: BasicForm
      },
      {
        path: 'table',
        name: 'toptable',
        component: BaseTable
      },
      {
        path: 'rollDetail',
        name: 'topBaseRollDetail',
        component: BaseRollDetail
      },
      {
        path: 'tree',
        name: 'topTree',
        component: BaseTree
      },
      {
        path: 'map',
        name: 'topMap',
        component: BaseMap
      },
      {
        path: '*',
        name: 'top404',
        component: Page404
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: Page404
  }
];

const router = new VueRouter({
  routes
});

export default router;
